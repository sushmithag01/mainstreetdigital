import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {CheckoutApi} from '../Utils/Api/CheckoutApi';

let user_id;
async function chackUserId() {
  user_id = await AsyncStorage.getItem('userId');
}

const PaymentFailure = ({route}) => {
  const navigation = useNavigation();
  const productdetail = route.params.productInfo;

  const handlePaymentFailed = async () => {
    const payload = {
      voucher_id: productdetail.city_voucher_id,
      mms_city_id: productdetail.mms_city_id,
      user_id: await AsyncStorage.getItem('userId'),
    };
    const checkOutRes = await CheckoutApi(payload);

    if (checkOutRes.stauts === 200) {
      navigation.navigate('Home', {
        screen: 'Checkout',
        params: {state: {productdetail: checkOutRes.data}},
      });
    } else if (checkOutRes.status === 429) {
      Toast.show(checkOutRes.message, {
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
          fontWeight: '500', // Increase the font size here
        },
      });
      navigation.replace('Home', {screen: 'Explore'});
    } else {
      Toast.show(checkOutRes.message, {
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
          fontWeight: '500', // Increase the font size here
        },
      });
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.space50}></View>
        <View style={[styles.redeemmain, styles.verfimain, styles.thankimg]}>
          <Image
            source={require('../assets/failure.png')}
            style={styles.thankimg}></Image>
        </View>
        <Text style={styles.thankyoutitle}>Oops, something went wrong!</Text>
        <View style={styles.thankcontent}>
          <Text style={[styles.label, styles.blacktext, styles.textcenter]}>
            We're sorry, but it seems that your transaction couldn't be
            completed at the moment.
          </Text>
          <View style={styles.space20}></View>
          <View style={[styles.thankbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={{
                backgroundColor: '#E66100',
                width: 200,
                alignItems: 'center',
                borderRadius: 10,
              }}
              onPress={() => handlePaymentFailed()}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat-Bold',
                  padding: 20,
                  fontSize:20
                }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default PaymentFailure;
