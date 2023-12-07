import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, where, query } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const MyReservationScreen = () => {
    const [bookingData, setBookingData] = useState([]);
    // const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // const bookingRef = collection(db, "bookings");
                const bookingRef = query(collection(db, "bookings"), where("user", "==", auth.currentUser.email));
                const querySnapshot = await getDocs(bookingRef);
                const bookingDataArray = querySnapshot.docs.map((doc) =>
                    doc.data()
                );
                setBookingData(bookingDataArray);

                // const q2 = query(collection(db, "users"));
                // const querySnapshot2 = await getDocs(q2);
                // const resultFromDB2 = [];
                // querySnapshot2.forEach((doc) => {
                //     resultFromDB2.push(doc.data());
                // }
                // );
                // setUsers(resultFromDB2);
                // console.log('Users from DB : ', users);

                const unsubscribe = onSnapshot(bookingRef, (snapshot) => {
                    const updatedBookingDataArray = snapshot.docs.map((doc) =>
                        doc.data()
                    );
                    setBookingData(updatedBookingDataArray);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const renderBookingItem = ({ item }) => {
        // console.log(item);
        return (
            <View
                style={{
                    borderBottomColor: "black",
                    borderWidth: 1,
                    marginBottom: 25,
                    padding: 5,
                }}
            >
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    <Image
                        source={{ uri: item.vehiclePic }}
                        style={{
                            width: '60%',
                            height: 150,
                            alignSelf: "center",
                            resizeMode: "contain",
                            marginHorizontal: 10,
                        }}
                    />
                    <View style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginHorizontal: 10,
                        // backgroundColor: "#f2f2f2",

                    }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', }}>Owner</Text>
                        <Image
                            source={{ uri: item.ownerPic }}
                            // source={{ uri: users.find((user) => user.email === item.owner).profile }}
                            style={{
                                width: 80,
                                height: 80,
                                alignSelf: "center",
                                resizeMode: "cover",
                                borderRadius: 40,
                                marginVertical: 5,
                            }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: '500', }}>{item.ownerName}</Text>
                        {/* <Text style={{ fontSize: 16, fontWeight: '500', }}>{users.find((user) => user.email === item.owner).name}</Text> */}
                    </View>
                </View>
                <View>
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Car Name</Text>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    </View>
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Booking Date</Text>
                        <Text style={{ fontSize: 16 }}>{item.bookingDate}</Text>
                    </View>
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Car License Plate</Text>
                        <Text style={{ fontSize: 16 }}>{item.licensePlate}</Text>
                    </View>
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Pick up at</Text>
                        <Text style={{ fontSize: 16 }}>{item.pickupLocation}</Text>
                    </View>
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Car Price</Text>
                        <Text style={{ fontSize: 16 }}>${item.price}</Text>
                    </View>
                    {/* <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Car Owner</Text>
                        <Text style={{ fontSize: 16 }}>{item.owner}</Text>
                    </View> */}
                    {/* <View style={styles.detailWrap}>
                        <Text style={{fontSize: 16}}></Text>
                        <Text style={{fontSize: 16}}>{item.ownerPic}</Text>
                        </View> */}
                    <View style={styles.detailWrap}>
                        <Text style={{ fontSize: 16, fontWeight: '500', }}>Booking Status</Text>
                        <Text style={[
                            { fontSize: 16 },
                            { fontWeight: "bold" },
                            {
                                color:
                                    item.bookingStatus === "Approved"
                                        ? "green"
                                        : item.bookingStatus === "Declined"
                                            ? "red"
                                            : "black",
                            },
                        ]}>{item.bookingStatus}</Text>
                    </View>
                    {item.code !== "" && item.bookingStatus == "Approved" && (
                        <View style={styles.detailWrap}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                            }}>Booking ID</Text>
                            <Text>{item.code}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={bookingData}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item.bid}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    detailWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 5
    },
});

export default MyReservationScreen;
