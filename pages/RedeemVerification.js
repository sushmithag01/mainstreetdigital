import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import OTPTextInput from 'react-native-otp-textinput';
import {OtpCheck} from '../Utils/Validations';
import {VerifyMobileOtpCodeAPI} from '../Utils/Api/VerifyMobileOtpCode';
import {SendVerficationCodeAPI} from '../Utils/Api/SendMobileVerficationCode';
import ErrorLabel from './ErrorLabel';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VerifyRedeemVoucherApi} from '../Utils/Api/VerifyRedeemVoucherApi';
import {VerifyUserEmailOtpApi} from '../Utils/Api/VerifyUserEmailOtpApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Snackbar} from 'react-native-paper';
import {SessionTimeOut} from '../Utils/ErrorMessage';

const RedeemVerification = ({route}) => {
  const navigation = useNavigation();
  const route_params = route.params.state;
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [Otp_value, setOTP] = useState('');
  const [otpValidation, setOtpValidation] = useState('');
  const [ResponseMessage, setResponseMessage] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [productParams, setProductParams] = useState([]);
  const [routeParams, setRouteParams] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      header: props => (
        <>
          <View style={styles.headerhomesingle}>
            <TouchableOpacity
              style={[styles.backbtnmain, styles.backinnert]}
              onPress={() => navigation.goBack()}>
              <Ionicons
                color="#E66100"
                name="chevron-back"
                style={styles.backicon}
                size={23}
              />
              <Text style={styles.backbtntext}>
                {route_params.PageName === 'editEmail'
                  ? 'Email Verification'
                  : route_params.PageName === 'mobile'
                  ? 'Phone Number Verification'
                  : 'Redeem Verification'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ),
    });
    setProductParams(route_params.productdetail);
    setRouteParams(route_params.RouteParams);
  }, [route_params]);

  // console.log("route_params",route_params)

  const otpHandler = async data => {
    const payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const VerifyOtp = await VerifyMobileOtpCodeAPI(data);
    if (VerifyOtp.success == true) {
      setOTP('');
      Toast.show(VerifyOtp.message, {
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
      navigation.navigate('MyProfile');
    } else {
      if (VerifyOtp.status === 429) {
        Toast.show(VerifyOtp.message, {
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
        navigation.navigate('MyProfile');
      } else if (
        VerifyOtp.message === 'Token is invalid!' ||
        VerifyOtp.message === 'Request failed with status code 403'
      ) {
        AsyncStorage.clear();
        navigation.navigate('Publicc', {screen: 'SignIn'});
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
      } else {
        Toast.show(VerifyOtp.message, {
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
  };

  const VerifyHandler = async event => {
    event.preventDefault();
    const OtpValidation = OtpCheck(Otp_value);
    if (OtpValidation.input === 'empty') {
      setOtpValidation(OtpValidation.err_display);
    }
    if (OtpValidation.input === 'LessCharacters') {
      setOtpValidation(OtpValidation.err_display);
    }
    if (OtpValidation.validition === true) {
      if (route_params.pageName == 'redeemVoucher') {
        let data = {
          recent_id: routeParams.recent_id,
          user_id: await AsyncStorage.getItem('userId'),
          voucher_id: productParams.city_voucher_id,
          otp: parseInt(Otp_value),
        };
        console.log('data', data);
        VerifyVoucherhandler(data);
      }
      if (route_params.PageName == 'editEmail') {
        let data = {
          email_address: route_params.email_address,
          user_id: await AsyncStorage.getItem('userId'),
          otp: parseInt(Otp_value),
        };
        VerifyUserEmailhandler(data);
      } else if (route_params.PageName === 'mobile') {
        let payload = {
          user_id: route_params.user_id,
          mobile_number: route_params.mobile_number,
          otp: parseInt(Otp_value),
        };
        otpHandler(payload);
      }
    }
  };
  // verify user email after
  const VerifyUserEmailhandler = async data => {
    const payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const verifyEmailOtp = await VerifyUserEmailOtpApi(data);

    if (verifyEmailOtp.status == 200) {
      setOTP('');
      Toast.show(verifyEmailOtp.message, {
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
      navigation.navigate('MyProfile');
    } else {
      if (verifyEmailOtp.status == 429) {
        Toast.show(verifyEmailOtp.message, {
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
        navigation.replace('MyProfile');
      } else if (
        verifyEmailOtp.message === 'Token is invalid!' ||
        verifyEmailOtp.message === 'Request failed with status code 403'
      ) {
        AsyncStorage.clear();
        navigation.navigate('Publicc', {screen: 'SignIn'});
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
      } else {
        Toast.show(verifyEmailOtp.message, {
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
  };
  // verify Vocher OTP
  const VerifyVoucherhandler = async data => {
    const verifyVoucher = await VerifyRedeemVoucherApi(data);
    if (verifyVoucher.status == 200) {
      setOTP('');
      Toast.show(verifyVoucher.message, {
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
      navigation.navigate('RedeemSuccess');
      // navigation.navigate('Account', {params: {selected_index: 0}});
    } else {
      if (verifyVoucher.status === 429) {
        navigation.navigate('Account', {params: {selected_index: 0}});
        Toast.show(verifyVoucher.message, {
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
        verifyVoucher.message === 'Token is invalid!' ||
        verifyVoucher.message === 'Request failed with status code 403'
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
      } else {
        Toast.show(verifyVoucher.message, {
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
  };
  //  resend
  const handleResendCode = async () => {
    let payload = {
      user_id: route_params.user_id,
      mobile_number: route_params.mobile_number,
    };
    const getResendOtp = await SendVerficationCodeAPI(payload);
    if (getResendOtp.status === '200') {
      Toast.show(getResendOtp.message, {
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
    } else if (getResendOtp.status === 429) {
      Toast.show(getResendOtp.message, {
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
      navigation.navigate('MyProfile');
    }
  };

  const handleCancelBtn = async () => {
    navigation.goBack();
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
          <Image source={require('../assets/r2.png')}></Image>
          <Text style={styles.redeemtext1}>Verification Page</Text>
          <Text style={styles.redeemtext2}>
            You will get the verification code via{' '}
            {route_params.PageName === 'mobile' ? 'message' : 'email'}
          </Text>
          <View>
            <OTPTextInput
              handleTextChange={value => {
                setOTP(value);
                setOtpValidation('');
              }}
              inputCount={6}
              inputCellLength={1}
              tintColor="#E66100"
              keyboardType="numeric"
              autoFocusOnLoad={false}
              textInputStyle={styles.verifyCode}
              containerStyle={styles.otpmain}
            />
            {otpValidation ? <ErrorLabel ErrorDisplay={otpValidation} /> : null}
            {ResponseMessage && (
              <Text style={styles.successRes}>{ResponseMessage}</Text>
            )}
            {/* <Button title="clear" /> */}
          </View>
          <View style={styles.space20}></View>
          <View style={styles.space20}></View>
          <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={[styles.applybtn, styles.orgoutline]}
              onPress={VerifyHandler}>
              <Text style={styles.applytext}>Verify</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={[styles.closebtn, styles.orgoutline]}
              onPress={() => handleCancelBtn()}>
              <Text style={[styles.closebtntext, styles.orgtext]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.redeemtext2}>
            Didn't receive the verification code?
          </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={[styles.applytext, styles.orgtext]}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};
export default RedeemVerification;
