import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorLabel from './ErrorLabel';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import {formatPhoneNumber, validatePhoneNumber} from '../Utils/Validations';
import {SendVerficationCodeAPI} from '../Utils/Api/SendMobileVerficationCode';
import Toast from 'react-native-root-toast';
import {Snackbar} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SessionTimeOut} from '../Utils/ErrorMessage';

let user_id;
async function chackUserId() {
  user_id = await AsyncStorage.getItem('userId');
}

const MobileVerification = ({route}) => {
  const route_params = route.params.state;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [mobile_vald, setMobileVald] = useState('');
  const [eu_mobile_num, setMobileNum] = useState('');
  const [ResponseMessage, setResponseMessage] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [responseData, setresponseData] = useState('');
  const [userID, setUserId] = useState('');

  useEffect(() => {
    chackUserId().then(() => {
      setUserId(user_id);
    });
    setMobileNum('');
  }, []);

  const onMobileChange = event => {
    let formattedValue = formatPhoneNumber(event.nativeEvent.text);
    setMobileNum(formattedValue);
    if (!validatePhoneNumber(formattedValue)) {
      setMobileVald('Please enter a valid mobile number!');
    } else {
      setMobileVald('');
    }
  };

  const sendVerficationCode = async event => {
    event.preventDefault();
    if (eu_mobile_num.length === 0) {
      setMobileVald('Mobile number is required!');
    } else if (mobile_vald === '' && eu_mobile_num.length !== 0) {
      handleSend();
    } else {
      console.log('not filled');
    }
  };

  const handleSend = async () => {
    const mobile_number = eu_mobile_num.replace(/-/g, '');
    let payload = {
      mobile_number: parseInt(mobile_number),
      user_id: userID,
    };
    console.log(payload, 'payload');
    const getOtp = await SendVerficationCodeAPI(payload);
    console.log(getOtp, 'getOtp');
    if (getOtp.success == true) {
      Toast.show(getOtp.message, {
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
      setresponseData(getOtp);
      navigation.navigate('RedeemVerification', {
        state: {
          VerifyFor: 'mobile',
          PageName: 'mobile',
          user_id: userID,
          otp: getOtp.otp,
          mobile_number: eu_mobile_num,
        },
      });
    } else {
      if (getOtp.status === 429) {
        Toast.show(getOtp.message, {
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
        navigation.replace('MyProfile');
      } else if (getOtp.message === 'Request failed with status code 500') {
        Toast.show('Something went wrong..!!', {
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
        getOtp.message === 'Token is invalid!' ||
        getOtp.message === 'Request failed with status code 403'
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
        Toast.show(getOtp.message, {
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

  console.log("eu_mobile_num",eu_mobile_num)
  return (
    <>
      <ScrollView>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
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
          <View style={[styles.redeemmain, styles.verfimain]}>
            <Image source={require('../assets/r2.png')}></Image>
          </View>
          <Text style={styles.redeemtext1}>Change Mobile Number</Text>
          <View style={styles.mainformnobg}>
            <Text style={[styles.label, styles.blacktext]}>
              Enter New Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.infoTextSpace}>
              &#40;Numbers only. No dash (-) or dot(.) between numbers&#41;
            </Text>

            <View
              style={{
                justifyContent: 'space-around',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                style={[
                  {
                    marginRight: 2,
                  },
                  styles.Countryinput,
                  styles.blacktext,
                ]}
                placeholder="+1"
                placeholderTextColor="#ccc"
                editable={false}
                value="+1"
              />
              <TextInput
                style={[styles.input, styles.blacktext]}
                placeholder="Enter New Mobile Number"
                placeholderTextColor="#ccc"
                onChange={onMobileChange}
                value={eu_mobile_num}
              />
            </View>

            {mobile_vald ? <ErrorLabel ErrorDisplay={mobile_vald} /> : null}
            {ResponseMessage && (
              <Text style={styles.successRes}>{ResponseMessage}</Text>
            )}

            <View
              style={[
                styles.checkbtnmain,
                styles.deatilsbtninner,
                {marginTop: 30},
              ]}>
              <TouchableOpacity
                style={[styles.applybtn, styles.orgoutline]}
                onPress={event => sendVerficationCode(event)}>
                <Text style={styles.applytext}>Send Verification code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};

export default MobileVerification;
