import { Text, Image, View, ScrollView, ActivityIndicator, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

export default function ListingSearch({ navigation, route }) {

    const [listingData, setListingData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataFromAPI = async () => {
        const apiURL = 'https://sahil-randhawa.github.io/react-native-project-api/vehicles.json';

        const response = await fetch(apiURL);
        try {
            try {
                const json = await response.json();
                setListingData(json);
            } catch (error) {
                console.error(error);
            }
        } finally {
            return setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromAPI();
    }, []);


    const renderItem = ({ item }) => (
        <Pressable
            style={{
                flex: 1,
                flexDirection: "row",
                gap: 5,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "space-evenly",
                paddingHorizontal: 10,
                paddingVertical: 5,
            }}
            onPress={() => {
                const selectedCar = {
                    name: item.make + " " + item.model + " " + item.trim,
                    price: item.msrp,
                    seatingCapacity: item.seats_min,
                    vehicleType: item.form_factor,
                    range: item.electric_range,
                    images: item.images,
                    make: item.make,
                    model: item.model,
                };
                // console.log("Car selected : ", selectedCar);
                navigation.navigate("CreateListing", { selectedCar });
            }}
        >
            <View
                style={{
                    // flex: 1,
                    width: "40%",
                }}
            >
                <Image
                    style={{
                        height: 120,
                        resizeMode: "contain",
                        borderRadius: 10,
                    }}
                    source={{ uri: item.images[0].url_thumbnail }}
                />
            </View>
            <View style={styles.listItemDetails}>
                <Text style={styles.vehicleTitle}>
                    {item.make} {item.model} {item.trim}{" "}
                </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.carDetailLabel}>MSRP:</Text>
                        <Text>${item.msrp}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.carDetailLabel}>Range:</Text>
                        <Text>{item.electric_range} KM</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.carDetailLabel}>Seating Capacity:</Text>
                        <Text>{item.seats_min} seats</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.carDetailLabel}>Drivetrain:</Text>
                        <Text>{item.drivetrain}</Text>
                    </View>
            </View>
        </Pressable>
    );

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 20,
        }}>
            <TextInput
                style={styles.searchField}
                placeholder="Search by make"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />
            <FlatList
                style={{
                    width: '100%',
                }}
                data={listingData.filter((item) => {
                    return item.handle.toLowerCase().includes(searchText.toLowerCase());
                })}
                renderItem={renderItem}
                keyExtractor={item => item.handle}
                ItemSeparatorComponent={() => <View style={styles.separator}
                />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchField: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    listItemDetails: {
        // flex: 1,
        flexDirection: 'column',
        padding: 10,
        gap: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        width: '60%',
    },
    vehicleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    carDetailLabel: {
        fontWeight: '500',
    },
    separator: {
        height: 5,
        width: '100%',
        // backgroundColor: '#CED0CE',
    },
});