import { Text, View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import ManageBookings from "./manageBookings";
import ListingSearch from "./listing";
import CreateListing from "./createListing";
import ProfileScreen from "./profileScreen";

import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ListingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListingSearch"
                component={ListingSearch}
                options={{
                    headerTitle: "New Listing",
                    headerTitleAlign: "center",
                    headerStyle: {
                        // backgroundColor: '#f4511e',
                    },

                    // disble back button
                    headerLeft: null,

                    // headerTintColor: '#f4511e',
                    headerTitleStyle: {
                        fontSize: 24,
                    },
                }}
            />
            <Stack.Screen
                name="CreateListing"
                component={CreateListing}
                options={{
                    headerTitle: "Create Listing",
                    headerTitleAlign: "center",
                    headerStyle: {
                        // backgroundColor: '#f4511e',
                    },
                    // headerTintColor: '#f4511e',
                    headerTitleStyle: {
                        fontSize: 24,
                    },
                }}
            />
        </Stack.Navigator>
    );
}

export default function HomeScreen({ navigation, route }) {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Listing') {
                            iconName = focused ? "th-list" : "list";
                        } else if (route.name === 'ManageBookings') {
                            iconName = focused ? "bookmark" : "bookmark-o";
                        } else if (route.name === 'Profile') {
                            iconName = focused ? "user" : "user-o";
                        }

                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    // tabBarActiveTintColor: "tomato",
                    // tabBarInactiveTintColor: "gray",
                    headerStyle: {
                        // backgroundColor: '#f4511e',
                    },
                    //   headerTintColor: '#f4511e',
                    headerTitleStyle: {
                        fontSize: 24,
                    },
                })}
            >
                <Tab.Screen
                    name="Listing"
                    component={ListingStack}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="ManageBookings"
                    component={ManageBookings}
                    options={{
                        headerTitle: "Manage Bookings",
                        headerTitleAlign: "center",
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        headerTitle: "Profile",
                        headerTitleAlign: "center",
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "white",
    },
});