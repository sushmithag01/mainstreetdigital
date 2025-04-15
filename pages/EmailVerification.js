import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar} from 'react-native-paper';
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
import {EmailCheck} from '../Utils/Validations';
import {SendEmailVerficationCodeAPI} from '../Utils/Api/SendEmailVerficationCode';
import Toast from 'react-native-root-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SessionTimeOut} from '../Utils/ErrorMessage';

let user_id;

async function checkUser_id() {
  user_id = await AsyncStorage.getItem('userId');
}

const EmailVerification = ({route}) => {
  const navigation = useNavigation();
  const route_params = route.params.state;
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [email_vald, setEmailVald] = useState('');
  const [eu_email, setEmail] = useState('');
  const [ResponseMessage, setResponseMessage] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [userID, setUserId] = useState('');
  const [responseData, setResponseData] = useState('');

  useEffect(() => {
    checkUser_id().then(() => {
      setUserId(user_id);
    });
  }, []);

  const onEmail = event => {
    setEmail(event.nativeEvent.text);
    setEmailVald('');
  };
  const SendverificationCode = async event => {
    event.preventDefault();
    const EmailValidation = EmailCheck(eu_email);
    if (EmailValidation.input === 'empty') {
      setEmailVald(EmailValidation.err_display);
    } else if (EmailValidation.input === 'invalid') {
      setEmailVald(EmailValidation.err_display);
    }

    if (EmailValidation.validition == true) {
      let payload = {
        email_address: eu_email,
        user_id: userID,
      };
      const getEmailOtp = await SendEmailVerficationCodeAPI(payload);
      console.log(getEmailOtp, 'getEmailOtp');
      if (getEmailOtp.success == true) {
        Toast.show(getEmailOtp.message, {
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
        setResponseData(getEmailOtp);
        navigation.navigate('RedeemVerification', {
          state: {
            PageName: 'editEmail',
            user_id: userID,
            otp: getEmailOtp.otp,
            email_address: eu_email,
          },
        });
      } else {
        if (getEmailOtp.status === 429) {
          Toast.show(getEmailOtp.message, {
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
        } else if (
          getEmailOtp.message === 'Token is invalid!' ||
          getEmailOtp.message === 'Request failed with status code 403'
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
          Toast.show(getEmailOtp.message, {
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
    } else {
      console.log('error');
    }
  };
  return (
    <>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
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
          <View style={styles.redeemmain}>
            <Image source={require('../assets/r3.png')}></Image>
          </View>
          <Text style={styles.redeemtext1}>Change Email Address</Text>
          <View style={styles.mainformnobg}>
            <Text style={[styles.label, styles.blacktext]}>
              {' '}
              Enter New Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter New Email Address"
              placeholderTextColor="#ccc"
              onChange={onEmail}
              value={eu_email}
            />
            {email_vald ? <ErrorLabel ErrorDisplay={email_vald} /> : null}
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
                onPress={event => SendverificationCode(event)}>
                <Text style={styles.applytext}>Send Verification code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
};
export default EmailVerification;
