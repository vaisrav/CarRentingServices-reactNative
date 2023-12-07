import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ActivityIndicator,
    ScrollView,
    Image,
    SafeAreaView,
    Alert,
} from "react-native";

import { useState, useEffect } from "react";

// TODO: Import location library
import * as Location from "expo-location";

// library for mapview and marker
import MapView, { Marker } from "react-native-maps";

// library for custom markers on map
import { Entypo } from "@expo/vector-icons";

//firebase related imports
import {
    doc,
    addDoc,
    setDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { db, auth } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SearchScreen = () => {
    const [deviceLocation, setDeviceLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [carsData, setCarsData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // fetching data from db into carsData variable
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const CarsRef = collection(db, "listings");
                const querySnapshot = await getDocs(CarsRef);
                const CarsDataArray = querySnapshot.docs.map((doc) =>
                    doc.data()
                );
                setCarsData(CarsDataArray);

                const unsubscribe = onSnapshot(CarsRef, (snapshot) => {
                    const updatedCarsDataArray = snapshot.docs.map((doc) =>
                        doc.data()
                    );
                    setCarsData(updatedCarsDataArray);
                });

                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching Cars:", error);
            }
        };

        fetchCars();
    }, []);

    //getting current location of the current user
    const getCurrentLocation = async () => {
        try {
            // 1. get permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert(`Permission to access location was denied`);
                return;
            }
            // alert("Permission granted");

            let location = await Location.getCurrentPositionAsync();
            // alert(JSON.stringify(location));
            // console.log(location);

            setDeviceLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        } catch (err) {
            console.log(err);
        }
    };

    // calling the getCurrentLocation function on load i.e., inside useEffect
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Function to handle marker press to select the specific marker to use for later purposes
    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        console.log("this marker is pressed:", marker);
    };

    // reserving the car selected onto the db
    const reserveCar = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("Please sign in to make a booking.");
            return;
        }

        //generating a random future date
        const futureDate = () => {
            const currentDate = new Date();
            const numberOfDaysToAdd = Math.floor(Math.random() * 365);
            const futureDate = new Date(
                currentDate.getTime() + numberOfDaysToAdd * 24 * 60 * 60 * 1000
            );
            return futureDate;
        };

        const futureReservationDate = futureDate();
        const dateFormat = { year: "numeric", month: "short", day: "2-digit" };
        const formattedDate = futureReservationDate.toLocaleDateString(
            "en-US",
            dateFormat
        );
        try {
            const userRef = collection(db, "users");
            const userQuerySnapshot = await getDocs(
                query(userRef, where("email", "==", user.email))
            );

            if (userQuerySnapshot.empty) {
                // User not found in the "users" collection
                alert("User not found. Please check your email.");
                return;
            }

            // Assuming the email is unique, we can safely access the first document in the snapshot
            const userData = userQuerySnapshot.docs[0].data();

            const bookingRef = collection(db, "bookings");
            const q = query(
                bookingRef,
                where("name", "==", selectedMarker.name),
                where("user", "==", user.email),
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                Alert.alert("Booking already made!");
            } else {

                const ownerRef = collection(db, "users");
                const ownerUserQuerySnapshot = await getDocs(
                    query(ownerRef, where("email", "==", selectedMarker.owner))
                );
                const ownerUserData = ownerUserQuerySnapshot.docs[0].data();

                const newDocRef = doc(bookingRef);

                const bookingDataToAdd = {
                    bid: newDocRef.id,
                    name: selectedMarker.name,
                    price: selectedMarker.price,
                    bookingStatus: "Pending",
                    licensePlate: selectedMarker.licensePlate,
                    bookingDate: formattedDate,
                    owner: selectedMarker.owner,
                    ownerName: ownerUserData.name,
                    ownerPic: ownerUserData.profile,
                    code: "",
                    model: selectedMarker.model,
                    make: selectedMarker.make,
                    vehiclePic: selectedMarker.images[0],
                    pickupLocation: selectedMarker.pickUpLocation,
                    user: user.email,
                    renterName: userData.name,
                    renterPic: userData.profile,
                    // ownerPic: user.profile,
                };

                console.log(' Booking to be Added : ', bookingDataToAdd);

                await setDoc(newDocRef, bookingDataToAdd);

                // await addDoc(bookingRef, {
                //     bid: newDocRef.id,
                // });
                alert(
                    `Reservation sent for approval \n you can check status in my bookings ${futureReservationDate.toDateString()}`
                );
            }
        } catch (error) {
            console.error("Error Booking Car:", error);
            alert("Failed to book a Car");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator
                        size="large"
                        color="#000"
                        animating={true}
                    />
                </View>
            ) : (
                <ScrollView style={{ padding: 20 }}>
                    {deviceLocation !== null && (
                        <View>
                            <Text style={{ fontSize: 16, paddingBottom: 10 }}>
                                Your Current Location:
                            </Text>
                            <MapView
                                style={{ height: 250, width: "100%" }}
                                initialRegion={{
                                    latitude: deviceLocation.lat,
                                    longitude: deviceLocation.lng,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: deviceLocation.lat,
                                        longitude: deviceLocation.lng,
                                    }}
                                ></Marker>
                                {/* Render multiple markers using the markerData array */}
                                {carsData.map((marker) => (
                                    <Marker
                                        key={marker.licensePlate}
                                        coordinate={{
                                            latitude: marker.coordinates.lat,
                                            longitude: marker.coordinates.lng,
                                        }}
                                        title={marker.name}
                                        // description={marker.owner}
                                        onPress={() =>
                                            handleMarkerPress(marker)
                                        }
                                    >
                                        <View
                                            style={{
                                                borderWidth: 3,
                                                borderColor: "blue",
                                                backgroundColor: "blue",
                                                height: 25,
                                                width: "auto",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontSize: 12,
                                                }}
                                            >
                                                $ {marker.price}
                                            </Text>
                                        </View>
                                    </Marker>
                                ))}
                            </MapView>
                        </View>
                    )}

                    <View>
                        {selectedMarker && carsData.length > 0 && (
                            <View style={{ paddingVertical: 20 }}>
                                <ScrollView
                                    horizontal
                                    style={{ marginBottom: 20 }}
                                >
                                    {selectedMarker.images.map(
                                        (image, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: image }}
                                                style={{
                                                    width: 200,
                                                    height: 120,
                                                    marginRight: 10,
                                                }}
                                            />
                                        )
                                    )}
                                </ScrollView>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={styles.detailText}>
                                        Car name:
                                    </Text>
                                    <Text style={styles.detailText}>
                                        {selectedMarker.name}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={styles.detailText}>
                                        MSRP:{" "}
                                    </Text>
                                    <Text style={styles.detailText}>
                                        $ {selectedMarker.price}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={styles.detailText}>
                                        licensePlate:
                                    </Text>
                                    <Text style={styles.detailText}>
                                        {selectedMarker.licensePlate}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={styles.detailText}>
                                        EV Range:
                                    </Text>
                                    <Text style={styles.detailText}>
                                        {selectedMarker.range} km
                                    </Text>
                                </View>

                                <Pressable
                                    style={styles.btn}
                                    onPress={reserveCar}
                                >
                                    <Text style={styles.btnLabel}>
                                        Book Vehicle
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: Platform.OS === "ios" ? 20 : 0,
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10,
    },
    btnLabel: {
        fontSize: 18,
        textAlign: "center",
    },
    tb: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    },
    detailText: {
        fontSize: 16,
        flexShrink: 0,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SearchScreen;
