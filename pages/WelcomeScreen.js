import React, { useState } from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Common.css';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const [cityId, setCityId] = useState(0);
    const [countryList, setCountryList] = useState([]);

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View>
                <View>
                    <Image
                        source={require('../assets/welcomeimg.png')} style={{ width: '100%', alignItems: 'center', marginTop: 150 }}
                    ></Image>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.thankyoutitle1}>Welcome to Shop Local Digital!</Text>
                </View>
                <View style={styles.thankcontent1}>

                    <Text style={[styles.label1, styles.blacktext1, styles.textcenter1]}>
                        You can set the marketplace you came from as your favorite or explore deals from other marketplaces to discover exciting offers.
                    </Text>
                    <View style={styles.space20}></View>
                    <View style={[styles.thankbtnmain1]}>
                        <TouchableOpacity
                            style={[
                                styles.applybtn1,
                                styles.orgoutline1,
                                styles.thankbtn21,
                            ]}
                            onPress={() =>navigation.navigate('ExploreStackNavigator',{screen:'MarketPlaceLists'})}
                        >
                            <Text style={styles.applytext}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>

    )
}

export default WelcomeScreen