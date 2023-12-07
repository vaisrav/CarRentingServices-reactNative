import { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, StyleSheet} from 'react-native';

// import the auth variable
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation, route }) => {
    const [email, setEmail] = useState('sahil@gbc.com');
    const [password, setPassword] = useState('12345678');

    const handleLogin = async () => {
        //verify the email and password are not empty
        if (email === '' || password === '') {
            alert('Email and Password cannot be empty');
            return;
        }
        try {

            // check if the user role is owner or renter, hint: user document under users colection has a fiels isOwner which is a boolean
            // if the user is owner, sign in and navigate to HomeScreen
            // if the user is renter, dont sign in and show an alert saying "You are not authorized to login to Owner app, please use Renter app"
            // if the user is not found, show an alert saying "User not found, please check your email and password"

            const q = query(collection(db, "users"), where("email", "==", email));
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
            if (userFromDB.isOwner === false) {
                alert("You are not authorized to login to the Owner App \nPlease use Renter App");
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            console.log('user', user);
            // alert(`Login Success : ${user.email}`);

            //clear the email and password fields
            // setEmail('');
            // setPassword('');
            navigation.navigate('Home');
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('error', errorCode, errorMessage);
            alert(`Login Failed : ${errorMessage}`);
        }
    };

    return (
            <SafeAreaView style={{
                flex: 1,
            }}>
                <View style={styles.container}>
                    <Text
                        style={styles.textLabel}
                    >Email:</Text>
                    <TextInput
                        style={styles.inputField}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text.toLowerCase());
                        }} />

                    <Text
                        style={styles.textLabel}
                    >Password:</Text>
                    <TextInput
                        style={styles.inputField}
                        value={password}
                        onChangeText={setPassword} secureTextEntry />

                    <Pressable style={styles.loginPressable} onPress={handleLogin}>
                        <Text style={styles.loginButton}>Login</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    textLabel: {
        fontWeight: 'bold',
        fontSize: 24,
        width: '80%',
        textAlign: 'left',
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        // backgroundColor: '#f0f0f0',
        padding: 15,
        margin: 10,
        width: '80%',
        borderRadius: 10,
        marginBottom: 10,
    },
    loginButton: {
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginPressable: {
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 20,
        marginTop: 30,
        width: '80%',
        borderRadius: 10,
    }
});