import React, {useState, useEffect} from 'react';
import {ButtonGroup} from '@rneui/themed';
import {Text, ScrollView, View} from 'react-native';
import styles from '../Common.css';
import VoucherDropdown from './VoucherDropdown';
import CouponDropdown from './CouponDropdown';
import MyVoucherCard from './MyVoucherCard';
import MyCouponCard from './MyCouponCard';
import {MyVoucherApi} from '../Utils/Api/MyVoucherApi';
import {MyCouponApi} from '../Utils/Api/MyCouponApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import {Snackbar} from 'react-native-paper';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Loader from '../Utils/Loader';

let user_id;

async function getuserid() {
  user_id = await AsyncStorage.getItem('userId');
}

const Account = ({route}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userId, setUserId] = useState('');
  const [myVoucherdata, setVoucherData] = useState([]);
  const [myCoupondata, setCouponData] = useState([]);
  const [couponFilterVal, setSelectedCouponFilter] = useState('0');
  const [voucherFilterVal, setSelectedVoucherFilter] = useState('0');
  const [toastMsg, setToastMessage] = useState('');
  const [errorLable, setErrorLabel] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getuserid().then(() => {
        setUserId(user_id); 
      });
    }
  }, [selectedIndex, user_id, isFocused]);

  useEffect(()=>{
    if (isFocused) {
    MyAccountHandler();
    }
  },[selectedIndex,voucherFilterVal,couponFilterVal])

  useEffect(() => {
    if (route.params.selected_index === 1) {
      setSelectedIndex(1);
    } else {
      setSelectedIndex(0);
    }
  }, [route]);
  function selectedCouponFilterVal(item) {
    setSelectedCouponFilter(item);
  }

  function selectedVoucherFilterVal(item) {
    setSelectedVoucherFilter(item);
  }
  const MyAccountHandler = async () => {
    setLoading(true);
    const data = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    if (selectedIndex === 0) {
      const voucherData = await MyVoucherApi(data);
      console.log(
        'voucherData',
        voucherData.message === 'Request failed with status code 403',
      );
      if (voucherData.status == 200) {
        setVoucherData(voucherData.vouchers_list);
      } else {
        if (voucherData.status === 429) {
          setLoading(true);
          Toast.show(voucherData.message, {
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
        if (
          voucherData.message === 'Token is invalid!' ||
          voucherData.message === 'Request failed with status code 403'
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
              fontWeight: '500', // Increase the font size here
            },
          });
        }
      }
    } else {
      const couponData = await MyCouponApi(data);
      // console.log("couponData", couponData)
      if (couponData.status == 200) {
        setCouponData(couponData.coupons_list);
      } else {
        //Toast Message
        if (couponData.status === 429) {
          setLoading(true);
          Toast.show(couponData.message, {
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
        } else if (
          couponData.coupons_list &&
          !couponData.coupons_list.length < 0
        ) {
          Toast.show(couponData.message, {
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
        } else if (
          couponData.message === 'Token is invalid!' ||
          couponData.message === 'Request failed with status code 403'
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
              fontWeight: '500', // Increase the font size here
            },
          });
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : null}
      <ScrollView>
        <View
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            top: 0,
            width: '92%',
            zIndex: 999999,
            overflow: 'visible',
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
        <ButtonGroup
          buttons={['My Vouchers', 'My Coupons ']}
          selectedIndex={selectedIndex}
          onPress={value => {
            setSelectedIndex(value);
          }}
          containerStyle={styles.btncontainer}
          selectedButtonStyle={styles.selectedbtn}
          buttonContainerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.textStyle}
        />
        {selectedIndex === 0 && myVoucherdata.length > 0 ? (
          <>
            <VoucherDropdown selectedFilterVal={selectedVoucherFilterVal} />
            <View style={styles.space20}></View>
            <View style={styles.marginhz15}>
              <MyVoucherCard
                myAccountData={myVoucherdata}
                FilterVal={voucherFilterVal}
              />
            </View>
          </>
        ) : selectedIndex === 1 && myCoupondata.length > 0 ? (
          <>
            <CouponDropdown selectedFilterVal={selectedCouponFilterVal} />
            <View style={styles.space20}></View>
            <View style={styles.marginhz15}>
              <MyCouponCard
                myAccountData={myCoupondata}
                FilterVal={couponFilterVal}
              />
            </View>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '600',
              margin: 100,
            }}>
            {' '}
            No Data Available..!!
          </Text>
        )}
      </ScrollView>
    </>
  );
};

export default Account;
