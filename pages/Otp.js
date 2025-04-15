import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import styles from '../Common.css';
import ErrorLabel from './ErrorLabel';
import {OtpCheck} from '../Utils/Validations';
import {ForgotPasswordValidationApi} from '../Utils/Api/ForgotPasswordValidationApi';
import Toast from 'react-native-root-toast';
import {VerifySignOtpApi} from '../Utils/Api/VerifySignUpOtpApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar} from 'react-native-paper';
import {ForgotPasswordApi} from '../Utils/Api/ForgotPasswordApi';
import {SignUpApi} from '../Utils/Api/SignUpApi';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';

let UserEmail;

async function checkUserEmail() {
  UserEmail = await AsyncStorage.getItem('userEmail');
}

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const Otp = ({route}) => {
  const currentTimeZone = moment.tz.guess();
  const navigation = useNavigation();
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [visible, setVisible] = useState(false);
  const route_params = route.params.state;
  const otpInput = useRef(null);
  const [Otp_value, setOTP] = useState('');
  const [otpValidation, setOtpValidation] = useState('');
  const [user_id, setUserId] = useState('');
  const [user_token, setUserToken] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [timerCounter, setTimeCounter] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('route_params', route_params.pageName);
    navigation.setOptions({
      header: props => (
        <>
          <View style={[styles.headerhomesingleblack]}>
            <TouchableOpacity
              style={[styles.backbtnmain, styles.backinnert, styles.chatsingle]}
              onPress={() => {
                route_params.pageName === 'SignupVerification'
                  ? navigation.navigate('SignUp')
                  : navigation.navigate('ForgotPassword');
              }}>
              <Ionicons
                color="#E66100"
                name="chevron-back"
                style={styles.backicon}
                size={23}
              />
            </TouchableOpacity>
          </View>
        </>
      ),
    });
    checkUserEmail().then(() => {
      setUserEmail(UserEmail);
      setUserId(route_params.userId);
      setUserToken(route_params.userToken);
    });
  }, [route]);

  const ForgotPasswordApiHandler = async validateOtp => {
    const ForgotPswdApiResponse = await ForgotPasswordValidationApi(
      validateOtp,
    );
    // console.log("ForgotPswdApiResponse", ForgotPswdApiResponse, validateOtp);
    if (ForgotPswdApiResponse.success === true) {
      Toast.show(ForgotPswdApiResponse.message, {
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
      navigation.navigate('CreateNewPassword', {state: {token: user_token}});
      setOTP('');
    } else {
      if (ForgotPswdApiResponse.message === 'Token is invalid!') {
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
        Toast.show(ForgotPswdApiResponse.message, {
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

      setOTP('');
    }
  };
  const VerifySignUpOtp = async validateOtp => {
    console.log('validateOtp', validateOtp);
    const verifydata = await VerifySignOtpApi(validateOtp);
    console.log('verifydata', verifydata);
    if (verifydata.status == 200) {
      Toast.show(verifydata.message, {
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
      navigation.navigate('SignIn');
    } else {
      if (verifydata.message === 'Token is invalid!') {
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
        Toast.show(verifydata.message, {
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
      if (route_params.pageName === 'SignupVerification') {
        let validateOtp = {
          email_id: user_email,
          otp: parseInt(Otp_value),
          time_zone: currentTimeZone,
        };
        VerifySignUpOtp(validateOtp);
      } else {
        let validateOtp = {
          user_id: user_id,
          token: user_token,
          otp: parseInt(Otp_value),
        };
        ForgotPasswordApiHandler(validateOtp);
      }
    }
  };

  const ResendHandler = async event => {
    if (route_params.pageName === 'SignupVerification') {
      let SignUpDetails = {
        eu_first_name: route_params.SignUpCredentials.eu_first_name,
        eu_last_name: route_params.SignUpCredentials.eu_last_name,
        eu_email: route_params.SignUpCredentials.eu_email,
        eu_contact_number: parseInt(
          route_params.SignUpCredentials.eu_contact_number,
        ),
        eu_password: route_params.SignUpCredentials.eu_password,
        type: 1,
      };
      SignUpHandler(SignUpDetails);
      // console.ErrorDisplay(SignUpStatus);
    } else {
      ResendOTPForgotHandler();
    }
    // setLoading(true)
  };
  // console.log("route_params",route_params)
  const SignUpHandler = async SignUpCredentials => {
    // console.log("SignUpCredentials",SignUpCredentials)
    const SignUpStatus = await SignUpApi(SignUpCredentials);
    // console.log("SignUpStatus", SignUpStatus)
    if (SignUpStatus.status === 200) {
      Toast.show(SignUpStatus.eu_status, {
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
      navigation.navigate('Otp', {state: {pageName: 'SignupVerification'}});
    } else {
      Toast.show(SignUpStatus.eu_status, {
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
  };

  const ResendOTPForgotHandler = async () => {
    let payload = {
      check: route_params.forgot_pwd_input.check,
      forgot_pwd_input: route_params.forgot_pwd_input.forgot_pwd_input,
    };
    console.log('payload', payload);
    const forgotpassword = await ForgotPasswordApi(payload);
    if (forgotpassword.status === 200) {
      setLoading(false);
      Toast.show(forgotpassword.p_responseMessage, {
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
      // navigation.navigate("Otp", { state: { userId: forgotpassword.user_id, userToken: forgotpassword.token,forgot_pwd_input : ForgotPsswordCredentials.forgot_pwd_input } });
    }
    if (forgotpassword.success === false) {
      if (
        forgotpassword.p_responseMessage === 'Token is invalid!' ||
        forgotpassword.p_responseMessage ===
          'Request failed with status code 403'
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
        Toast.show(forgotpassword.p_responseMessage, {
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

  function handleTimeFinish() {
    setTimeCounter(!timerCounter);
    // navigation.navigate("ForgotPassword");
  }
  return (
    <>
      {/* {loading ?
        <Loader loading={loading} />
        : null} */}
      <SafeAreaView>
        <ScrollView style={styles.main} keyboardShouldPersistTaps={'handled'}>
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
          <View style={styles.logosection}>
            <Image
              source={require('../assets/Logo-new.png')}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.signintext}>
              {route_params.pageName === 'SignupVerification'
                ? 'Email Verfication '
                : 'Forgot Password'}
            </Text>

            {route_params.pageName === 'SignupVerification' && (
              <Text style={styles.receive}>
                <Text style={styles.receive}>
                  Please enter the one-time verification code sent to your
                  registered email
                </Text>
                {'\n'} {'\n'}
                <Text style={styles.receive}>
                  (If you haven't received the One-time verification code in
                  your inbox, we kindly request you to check your spam folder.)
                </Text>
              </Text>
            )}

            {route_params.pageName !== 'SignupVerification' && (
              <Text style={styles.receive}>
                {route_params.forgot_pwd_input.check === 2 ? (
                  <Text style={styles.receive}>
                    Please enter the one-time verification code sent to your
                    registered mobile number
                  </Text>
                ) : (
                  <Text style={styles.receive}>
                    <Text style={styles.receive}>
                      Please enter the one-time verification code sent to your
                      registered email
                    </Text>
                    {'\n'} {'\n'}
                    <Text style={styles.receive}>
                      (If you haven't received the One-time verification code in
                      your inbox, we kindly request you to check your spam
                      folder.)
                    </Text>
                  </Text>
                )}
              </Text>
            )}
          </View>
          <View>
            <OTPTextInput
              handleTextChange={value => {
                setOTP(value);
              }}
              inputCount={6}
              inputCellLength={1}
              tintColor="#E66100"
              keyboardType="numeric"
              autoFocusOnLoad={false}
              textInputStyle={styles.otp}
              containerStyle={styles.otpmain}
            />
            {otpValidation ? <ErrorLabel ErrorDisplay={otpValidation} /> : null}
            {/* <Button title="clear" /> */}
          </View>
          <Text style={styles.otp_war_text}>
            The verification code sent will expire in 10 minutes.
          </Text>
          <View>
            <TouchableOpacity style={styles.submitbtn} onPress={VerifyHandler}>
              <Text style={styles.submitbtntext}>Verify</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 10}}>
            <TouchableOpacity onPress={ResendHandler}>
              <Text style={styles.forgottext}>Resend Code</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{ marginTop: 10 }}>
            <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotBacktext}>Back</Text></TouchableOpacity>
          </View>*/}
          {/* <Text style={[styles.receive]}>(Do not refresh the page!)</Text>  */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Otp;
