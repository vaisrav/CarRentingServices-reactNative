import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import the hook for navigation

// import the auth variable
import { db, auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const LoginScreen = () => {
    const [usernameFromUI, setUsernameFromUI] = useState("vaisrav@gbc.com");
    const [passwordFromUI, setPasswordFromUI] = useState("12345678");
    const navigation = useNavigation();

    const onLoginClicked = async () => {
        //verify credentials
        if (usernameFromUI === '' || passwordFromUI === '') {
            alert('Email and Password cannot be empty');
            return;
        }
        try {
            const q = query(
                collection(db, "users"),
                where("email", "==", usernameFromUI)
            );
            const querySnapshot = await getDocs(q);
            const resultFromDB = [];
            querySnapshot.forEach((doc) => {
                resultFromDB.push(doc.data());
            });
            const userFromDB = resultFromDB[0];
            if (userFromDB === undefined) {
                alert("User not found, please check your email and password");
                return;
            }
            if (userFromDB.isOwner === true) {
                alert(
                    "You are not authorized to login to the Renter App \nPlease use the Owner App"
                );
                return;
            }
            const userCredential = await signInWithEmailAndPassword(
                auth,
                usernameFromUI,
                passwordFromUI
            );

            // alert(`Login success! ${auth.currentUser.email}`);
            navigation.navigate("Home");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.headerText}>Renter Login 🚘🔑</Text>

                <TextInput
                    style={styles.tb}
                    placeholder="peter@gmail.com"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    value={usernameFromUI}
                    onChangeText={setUsernameFromUI}
                />
                <TextInput
                    style={styles.tb}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    value={passwordFromUI}
                    onChangeText={setPasswordFromUI}
                />

                <Pressable style={styles.btn}>
                    <Text style={styles.btnLabel} onPress={onLoginClicked}>
                        Login
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ECF0F1",
        justifyContent: "center",
        padding: 20,
    },
    btn: {
        borderWidth: 1,
        // borderColor: "#141D21",
        backgroundColor: "#52BE80",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10,
        width: "80%",
        alignSelf: "center",
    },
    btnLabel: {
        fontSize: 18,
        textAlign: "center",
        color: "white",
    },
    tb: {
        width: "80%",
        borderRadius: 5,
        backgroundColor: "#fff",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 25,
        marginVertical: 10,
        alignSelf: "center",
        fontSize: 18,
    },
    formLabel: {
        fontSize: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
        alignSelf: "center",
    },
});

export default LoginScreen;
