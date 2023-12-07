import { Text, Image, View, Pressable, ActivityIndicator } from "react-native";

import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useState, useEffect } from "react";

export default function ProfileScreen({ navigation, route }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFromDB();
    }, []);

    const fetchFromDB = async () => {
        try {
            const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            const resultFromDB = [];
            querySnapshot.forEach((doc) => {
                resultFromDB.push(doc.data());
            });
            setUser(resultFromDB[0]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const logoutHandler = () => {
        auth.signOut();
        navigation.navigate("Login");
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {isLoading ? (
                <ActivityIndicator
                    style={{
                        marginTop: 50,
                    }}
                    animating={true}
                    size="large"
                />
            ) : (
                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                    <Image
                        source={{ uri: user.profile }}
                        style={{ width: 200, height: 200, borderRadius: 100 }}
                    />
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginVertical: 20,
                    }}>
                        {user.name}
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        // fontWeight: "bold"
                    }}>
                        {user.email}
                    </Text>
                    <Pressable
                        style={{
                            // backgroundColor: "#f4511e",
                            borderWidth: 2,
                            borderColor: "#f4511e",
                            paddingVertical: 20,
                            borderRadius: 10,
                            marginTop: 40,
                            width: '80%',
                            alignItems: "center",
                        }}
                        onPress={logoutHandler}
                    >
                        <Text
                            style={{
                                // color: "#f4511e",
                                fontSize: 20,
                                fontWeight: "bold"
                            }}>
                            Logout
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}