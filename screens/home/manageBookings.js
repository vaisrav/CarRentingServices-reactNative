import { Text, View, FlatList, StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";

import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export default function ManageBookings({ navigation, route }) {

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchFromDB();
        // fetchUsersFromDB();
    });

    // const fetchUsersFromDB = async () => {
    //     try {
    //         const q2 = query(collection(db, "users"));
    //         const querySnapshot2 = await getDocs(q2);
    //         const resultFromDB2 = [];
    //         querySnapshot2.forEach((doc) => {
    //             resultFromDB2.push(doc.data());
    //         }
    //         );
    //         setUsers(resultFromDB2);
    //         // console.log('setUsers from DB : ', users);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const fetchFromDB = async () => {
        try {
            const q = query(collection(db, "bookings"), where("owner", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            const resultFromDB = [];
            querySnapshot.forEach((doc) => {
                resultFromDB.push(doc.data());
            }
            );
            setBookings(resultFromDB);

            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            {/* Image of car */}
            <View style={{
                flex: 1,
                flexDirection: "row",
                gap: 5,
                justifyContent: "space-between",
            }}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.vehiclePic }}
                        style={{ 
                            width: '80%', 
                            height: '100%', 
                            resizeMode: "contain" }}
                    />
                </View>
                <View style={styles.renterContainer}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                    }}>Renter :</Text>
                    <Image
                        // source={{ uri: users.find((user) => user.email === item.user).profile }}
                        source={{ uri: item.renterPic }}
                        style={{ width: 80, height: 80, resizeMode: "cover", borderRadius: 40, marginVertical: 5 }}
                    />
                    {/* <Text style={styles.renterText}>{users.find((user) => user.email === item.user).name}</Text> */}
                    <Text style={styles.renterText}>{item.renterName}</Text>
                </View>
            </View>
            {/* Date of booking */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{item.bookingDate}</Text>
            </View>
            {/* make of car */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>Make:</Text>
                <Text style={styles.value}>{item.make}</Text>
            </View>
            {/* model of car */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>Model:</Text>
                <Text style={styles.value}>{item.model}</Text>
            </View>
            {/* license plate */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>License Plate:</Text>
                <Text style={styles.value}>{item.licensePlate}</Text>
            </View>
            {/* Price of rent */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.value}>${item.price}</Text>
            </View>
            {/* Renter name */}
            {/* <View style={styles.tableRow}>
                <Text style={styles.label}>Renter:</Text>
                <Text style={styles.value}>{item.user}</Text>
            </View> */}
            {/* booking status */}
            <View style={styles.tableRow}>
                <Text style={styles.label}>Status:</Text>
                <Text
                    style={[
                        styles.value,
                        { fontWeight: "bold" },
                        {
                            color:
                                item.bookingStatus === "Approved"
                                    ? "green"
                                    : item.bookingStatus === "Declined"
                                        ? "red"
                                        : "black",
                        },
                    ]}
                >
                    {item.bookingStatus}
                </Text>
            </View>
            {/* if booking is approved show confirmation code */}
            {item.bookingStatus === "Approved" && (
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Confirmation Code:</Text>
                    <Text style={styles.value}>{item.code}</Text>
                </View>
            )}

            {item.bookingStatus === "Pending" && (
                <View style={styles.tableRow}>
                    <Pressable
                        style={{
                            // back ground green
                            backgroundColor: "#4CAF50",
                            padding: 10,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        onPress={async () => {
                            console.log("Approve booking in progress");

                            const code = Math.floor(100000 + Math.random() * 900000);

                            try {
                                const docRef = doc(db, "bookings", item.bid);
                                await updateDoc(docRef, {
                                    bookingStatus: "Approved",
                                    code: code.toString(),
                                });
                                console.log(
                                    "Document successfully updated! : Booking Approved!"
                                );
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Text
                            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                        >
                            Approve
                        </Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: "#f44336",
                            padding: 10,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        onPress={async () => {
                            console.log("Decline booking in progress");

                            try {
                                const docRef = doc(db, "bookings", item.bid);
                                await updateDoc(docRef, {
                                    bookingStatus: "Declined",
                                });
                                console.log(
                                    "Document successfully updated! : Booking Declined!"
                                );
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Text
                            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                        >
                            Decline
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
    return (
        <View>
            {isLoading ? <ActivityIndicator style={{
                marginTop: 50,
            }} animating={true} size="large" /> : (
                <FlatList
                    data={bookings}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.bid}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "white",
        // alignItems: "center",
        // justifyContent: "center",
    },
    item: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        marginTop: 8,
        marginHorizontal: 16,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,

    },
    imageContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center",
    },
    renterContainer: {
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        width: "40%",
    },
    value: {
        fontSize: 14,
        width: "60%",
    },
});