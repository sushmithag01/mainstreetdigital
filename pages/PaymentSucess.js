import React, {useState} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Utils/Loader';

const PaymentSucess = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView>
        <View style={styles.space50}></View>
        <View style={[styles.redeemmain, styles.verfimain, styles.thankimg]}>
          <Image
            source={require('../assets/thank.png')}
            style={styles.thankimg}></Image>
        </View>
        <Text style={styles.thankyoutitle}>
          Congratulations on your purchase!
        </Text>
        <View style={styles.thankcontent}>
          <Text style={[styles.label, styles.blacktext, styles.textcenter]}>
            Thank you for choosing Shop Local Digital. Your purchase details has
            been sent to your registered email and is available under "My
            Account" for redeeming.
          </Text>
          <View style={styles.space20}></View>
          <View style={[styles.thankbtnmain, styles.deatilsbtninner]}>
          <TouchableOpacity
              style={[styles.orgoutline, styles.thankbtn1,{height:70,padding:10}]}
              onPress={() =>
                navigation.replace('Account', {
                  screen: 'Account',
                  params: {selected_index: 0},
                })
              }>
             <Text style={[styles.applytext1]}>View Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applybtn, styles.orgoutline, styles.thankbtn2,{height:70}]}
              onPress={() =>
                navigation.navigate('Exploree', {screen: 'Explore'})
              }>
              <Text style={styles.applytext}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default PaymentSucess;
