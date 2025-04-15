import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {DeleteUserAccountApi} from '../Utils/Api/DeleteUserAccountApi';

let user_id;
async function chackUserId() {
  user_id = await AsyncStorage.getItem('userId');
}

const DeleteConfirmation = () => {
  const navigation = useNavigation();
  const handleDeleteAccount = async () => {
    const deleteAccRes = await DeleteUserAccountApi();
    if (deleteAccRes.status === 200) {
      navigation.navigate('Exploree', {screen: 'MyProfile'});
      Toast.show(deleteAccRes.message, {
        duration: 6000,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000000',
        opacity: 1,
        textStyle: {
          fontSize: 18,
          fontWeight:"500" // Increase the font size here
        },
      });
    } else {
      if (deleteAccRes.status === 429) {
        navigation.navigate('Explore');
        Toast.show(deleteAccRes.message, {
          duration: 6000,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
          opacity: 1,
          textStyle: {
            fontSize: 18,
            fontWeight:"500" // Increase the font size here
          },
        });
      } else if (
        deleteAccRes.message === 'Token is invalid!' ||
        deleteAccRes.message === 'Request failed with status code 403'
      ) {
        AsyncStorage.clear();
        navigation.navigate('SignIn');
        Toast.show(SessionTimeOut, {
          duration: 6000,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
          opacity: 1,
          textStyle: {
            fontSize: 18,
            fontWeight:"500" // Increase the font size here
          },
        });
      } else {
        Toast.show(deleteAccRes.message, {
          duration: 6000,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
          opacity: 1,
          textStyle: {
            fontSize: 18,
            fontWeight:"500" // Increase the font size here
          },
        });
      }
    }
    // console.log("deleteAccRes",deleteAccRes)
  };
  return (
    <>
      <ScrollView>
        <View style={styles.space50}></View>
        <View style={[styles.redeemmain, styles.verfimain, styles.thankimg]}>
          <Image
            source={require('../assets/delete.png')}
            style={styles.thankimg}></Image>
        </View>
        <Text style={styles.thankyoutitle}>
          Are you sure you want to delete your account?
        </Text>
        <View style={styles.thankcontent}>
          <Text style={[styles.label, styles.blacktext, styles.textcenter]}>
            Once you confirm, our team will review your request and get back to
            you within 48 hours with the options.
          </Text>
          <View style={styles.space20}></View>
          <View style={[styles.thankbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={[styles.orgoutline, styles.dltbtn1]}
              onPress={() => handleDeleteAccount()}>
              <Text style={styles.applytext1}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applybtn, styles.orgoutline, styles.dltbtn2]}
              onPress={() =>
                navigation.navigate('Exploree', {screen: 'MyProfile'})
              }>
              <Text style={styles.applytext}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default DeleteConfirmation;
