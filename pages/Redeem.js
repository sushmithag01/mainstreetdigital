import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import {RedeemVoucherApi} from '../Utils/Api/RedeemVoucherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {Snackbar} from 'react-native-paper';
import {SessionTimeOut} from '../Utils/ErrorMessage';

const Redeem = ({route}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [routeParams, setRouteParams] = useState([]);
  const [toastMsg, setToastMessage] = useState('');
  const [productParams, setProductParams] = useState([]);

  useEffect(() => {
    setRouteParams(route.params.state.RouteParams);
    setProductParams(route.params.state.productdetail);
  }, [route, routeParams]);

  const redeemHandler = async () => {
    const data = {
      //hardcoded
      user_id: await AsyncStorage.getItem('userId'),
      voucher_id: productParams.city_voucher_id,
      recent_id: routeParams.recent_id,
    };
    const redeemData = await RedeemVoucherApi(data);
    console.log('redeemData', redeemData);
    if (redeemData.status == 200) {
      Toast.show(redeemData.message, {
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
      navigation.navigate('RedeemVerification', {
        state: {
          pageName: 'redeemVoucher',
          productdetail: productParams,
          RouteParams: routeParams,
        },
      });
    } else {
      if (redeemData.status == 429) {
        navigation.navigate('Account', {params: {selected_index: 0}});
        Toast.show(redeemData.message, {
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
        redeemData.message === 'Token is invalid!' ||
        redeemData.message === 'Request failed with status code 403'
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
        Toast.show(redeemData.message, {
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
  };
  return (
    <>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            top: 0,
            width: '92%',
            zIndex: 999999,
            overflow: 'visible',
            alignItems:'center'
          }}>
          {toastMsg ? (
            <Snackbar
              style={styles.toast}
              visible={visible}
              onDismiss={onDismissSnackBar}>
              <Text style={{color: '#000000', textAlign: 'center'}}>
                {toastMsg}
              </Text>
            </Snackbar>
          ) : null}
        </View>
        <View style={styles.redeemmain}>
          <Image source={require('../assets/r1.png')}></Image>
          <Text style={styles.redeemtext1}>
            Are you sure you want to redeem now?
          </Text>
          <Text style={styles.redeemtext2}>
            Make sure you are at the right place, at the right time before
            redeeming.
          </Text>
          <View style={styles.BtnContainer}>
            <TouchableOpacity
              style={[
                styles.closebtn,
                styles.orgoutline,
                styles.marginright10,
              ]} onPress={()=>navigation.navigate('Account',{selected_index:0})}>
              <Text style={[styles.closebtntext, styles.orgtext,{fontSize:18}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applybtn, styles.orgoutline,{height:50}]}
              onPress={redeemHandler}>
              <Text style={[styles.applytext,{fontSize:18,textAlign:'center'}]}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Redeem;
