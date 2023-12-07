import { Text, View, StyleSheet, Platform, TextInput, Pressable, Image, FlatList, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function CreateListing({ navigation, route }) {

    const { selectedCar } = route.params;
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const [seatingCapacity, setSeatingCapacity] = useState(0);
    const [vehihcleType, setVehicleType] = useState('');
    const [range, setRange] = useState(0);

    const [licensePlate, setLicensePlate] = useState('');

    const [pickUpLocation, setPickUpLocation] = useState('');
    const [price, setPrice] = useState('');

    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        console.log("Car selected : ", selectedCar);
        setName(selectedCar.name);
        setSeatingCapacity(selectedCar.seatingCapacity);
        setVehicleType(selectedCar.vehicleType);
        setPrice(selectedCar.price / 100);
        setRange(selectedCar.range);
        setImages(selectedCar.images.map((image) => image.url_thumbnail));


        // get location
        getLocationPermissions();

    }, []);

    const getLocationPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert(`Permission to access location was denied`);
            return;
        }
    };

    const buttonPressHandler = async () => {
        if (pickUpLocation === '' || licensePlate === '') {
            alert("Please fill all the fields");
            return;
        }
        const geoCodedLocation = await Location.geocodeAsync(pickUpLocation);
        const location = geoCodedLocation[0];
        if (location === undefined) {
            alert("Invalid Location, Please provide a valid address!");
            return;
        }
        setCoordinates({ lat: location.latitude, lng: location.longitude });

        if (coordinates.lat != 0 || coordinates.lng != 0) {
            const listingToBeSaved = {
                name: name,
                images: images,
                seatingCapacity: seatingCapacity,
                vehicleType: vehihcleType,
                range: range,
                licensePlate: licensePlate,
                price: price,
                pickUpLocation: pickUpLocation,
                coordinates: coordinates,
                owner: auth.currentUser.email,
                make: selectedCar.make,
                model: selectedCar.model,
            };

            console.log("Listing to be saved : ", listingToBeSaved);

            try {
                const insertResult = await addDoc(collection(db, "listings"), listingToBeSaved);
                console.log("New listing document written with ID: ", insertResult.id);
            } catch (e) {
                console.error("Error adding listing document: ", e);
            }

        } else {
            alert("Invalid Location Address, Please provide a valid address!");
            return;
        }

        alert("Listing Created");

        // navigate back to listing screen
        navigation.navigate("ListingSearch");

    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 25}
        >
            <ScrollView style={styles.container}>
                {/* images here*/}
                <View style={{
                    flexDirection: 'row',
                    // marginVertical: 10,
                    alignItems: 'center',
                }}>
                    <FlatList
                        data={images}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{
                                    width: 400,
                                    height: 200,
                                    resizeMode: "contain",
                                    marginHorizontal: 10,
                                }}
                            />
                        )}
                        keyExtractor={(item) => item}
                        horizontal={true}
                    />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Seating Capacity</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setSeatingCapacity(parseInt(text))}
                            value={seatingCapacity.toString()}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <TextInput

                            style={styles.input}
                            onChangeText={(text) => setVehicleType(text)}
                            value={vehihcleType}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Electric Range</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setRange(parseInt(text))}
                            value={range.toString()}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>License Plate</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setLicensePlate(text)}
                            value={licensePlate}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPrice(parseInt(text))}
                            value={price.toString()}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>Pick Up Location</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPickUpLocation(text)}
                            value={pickUpLocation}
                        />
                    </View>

                    <Pressable
                        style={styles.buttonPressable}
                        onPress={buttonPressHandler}
                    >
                        <Text style={styles.buttonText}>Create Listing</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        flex: 1,
        // justifyContent: 'center',
        padding: 20,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        width: '40%',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        fontSize: 18,
        width: '60%',
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    buttonPressable: {
        backgroundColor: '#f4511e',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
});