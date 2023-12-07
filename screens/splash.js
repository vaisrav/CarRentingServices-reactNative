import { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator, Text, SafeAreaView } from "react-native";

export default function Splash({ navigation, route }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigation.navigate("Login");
        }, 1500);
        return () => clearTimeout(timeout);
    });
    return (
        <SafeAreaView style={style.container}>
            {/* logo image here */}
            <Image
                // source={require("../assets/logo.png")}
                source={{uri : "https://ui-avatars.com/api/?name=EV&background=068FFF&color=FFF&bold=true&size=248&rounded=true"}}
                style={{
                    width: 200,
                    height: 200,
                    resizeMode: "contain",
                    marginBottom: 20,
                }}
            />
            <Text style={{
                fontWeight: 'bold',
                fontSize: 24,
                marginBottom: 20,
            }}>Owner App</Text>
            <ActivityIndicator animating={true} size="large" />
        </SafeAreaView>
    );
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
});