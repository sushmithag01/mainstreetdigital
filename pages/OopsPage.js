import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import {addEventListener} from '@react-native-community/netinfo';

let user_id;
let AuthToken;

async function chackUserId() {
  user_id = await AsyncStorage.getItem('userId');
  AuthToken = await AsyncStorage.getItem('token');
}

const OopsPage = () => {
  const navigation = useNavigation();
  const [authToken, setAuthtoken] = useState('');
  const [isInternetConnect, setInternetConnect] = useState('');
  const [isInternetReachable, setInternetReachable] = useState('');

  useEffect(() => {
    chackUserId().then(() => {
      setAuthtoken(AuthToken);
    });
  }, []);

  useEffect(() => {
    const timeinterval = setInterval(() => {
      // Subscribe
      const unsubscribe = addEventListener(state => {
        setInternetConnect(state.isConnected);
        setInternetReachable(state.isInternetReachable);
      });

      // Unsubscribe
      unsubscribe();
    }, 5000);
    return () => clearInterval(timeinterval);
    // requestPermissions()
  }, [isInternetConnect]);

  return (
    <>
      <ScrollView>
        <View style={styles.oopsContainer}></View>
        <View
          style={[styles.oopsmain, styles.oopsmainpagemain, styles.oopsimg]}>
          <Image
            source={require('../assets/Oops!.png')}
            style={styles.oopsimg}></Image>
        </View>

        <Text style={styles.thankyoutitle1}>Oops!</Text>
        <View style={styles.thankcontent1}>
          <Text style={[styles.label1, styles.blacktext1, styles.textcenter1]}>
            You don't seem to be connected to the internet.
          </Text>
          <View style={styles.space20}></View>
          <View style={[styles.thankbtnmain1]}>
            {isInternetConnect ? (
              <>
                {authToken ? (
                  <TouchableOpacity
                    style={[
                      styles.applybtn1,
                      styles.orgoutline1,
                      styles.thankbtn21,
                    ]}
                    onPress={() =>
                      navigation.navigate('ExploreStackNavigator', {
                        screen: 'Explore',
                      })
                    }>
                    <Text style={styles.applytext}>Try Again</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.applybtn1,
                      styles.orgoutline1,
                      styles.thankbtn21,
                    ]}
                    onPress={() => navigation.replace('SignIn')}>
                    <Text style={styles.applytext}>Try Again</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.applybtn1,
                  styles.orgoutline1,
                  styles.thankbtn21,
                ]}>
                <Text style={styles.applytext}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default OopsPage;
