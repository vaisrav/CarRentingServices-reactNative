import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import LoginScreen from './screens/login';
import SearchScreen from './screens/searchScreen';
import MyReservationScreen from './screens/MyReservationScreen';
import ProfileScreen from './screens/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home Search" component={SearchScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="search" size={size} color={color} />
        ),
      }}/>
      <Tab.Screen name="My Reservations" component={MyReservationScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="list" size={size} color={color} />
        ),
      }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" size={size} color={color} />
        ),
      }}/>
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen
          name="Home" component={TabNavigator} options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
