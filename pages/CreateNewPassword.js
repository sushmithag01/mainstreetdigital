import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {CreateNewPasswordApi} from '../Utils/Api/CreateNewPasswordApi';
import ErrorLabel from './ErrorLabel';
import {PasswordCheck, ConfirmPasswordCheck} from '../Utils/Validations';
import {Snackbar} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const CreateNewPassword = ({route}) => {
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const navigation = useNavigation();
  const route_params = route.params.state;
  const [user_token, setUserToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordvalidation, setPasswordvalidation] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [comfirmPasswdValidatoion, setConfirmPasswdvalidation] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [passworNewdState, setNewpasswordState] = useState(true);
  const [passworConfirmdState, setConfirmpasswordState] = useState(true);
  useEffect(() => {
    setUserToken(route_params.token);
    // navigation.setOptions({
    //   header: props =>
    //     <>
    //       <View style={[styles.headerhomesingleblack]}>
    //         <TouchableOpacity style={[styles.backbtnmain, styles.backinnert, styles.chatsingle]} onPress={() => { route_params.pageName === "SignupVerification" ? navigation.navigate('SignUp') : navigation.navigate('ForgotPassword') }}>
    //           <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
    //         </TouchableOpacity>
    //       </View>
    //     </>
    // });
  }, [route]);

  const onPassewordChange = event => {
    setPassword(event.nativeEvent.text);
    setPasswordvalidation('');
  };

  const onConfirmPassword = event => {
    setConfirmPassword(event.nativeEvent.text);
    setConfirmPasswdvalidation('');
  };

  const CreateNewPasswordHandler = async data => {
    const NewPswdResponse = await CreateNewPasswordApi(data);
    if (NewPswdResponse.status === true) {
      Toast.show(NewPswdResponse.p_responseMessage, {
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
      //Toast Message
      if (
        NewPswdResponse.p_responseMessage === 'Token is invalid!' ||
        NewPswdResponse.p_responseMessage ===
          'Request failed with status code 403'
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
            fontWeight:"500" // Increase the font size here
          },
        });
      } else {
        Toast.show(NewPswdResponse.p_responseMessage, {
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
        navigation.navigate('ForgotPassword');
      }
    }
  };

  const HandleSubmit = event => {
    event.preventDefault();
    const NewPasswordValidation = PasswordCheck(password);
    const ConfirmPasswordValidation = ConfirmPasswordCheck(
      password,
      confirm_password,
    );

    if (NewPasswordValidation.input === 'empty') {
      setPasswordvalidation(NewPasswordValidation.err_display);
    } else if (NewPasswordValidation.input === 'lesscharacters') {
      setPasswordvalidation(NewPasswordValidation.err_display);
    } else if (NewPasswordValidation.input === 'invalid') {
      setPasswordvalidation(NewPasswordValidation.err_display);
    }

    if (ConfirmPasswordValidation.input === 'empty') {
      setConfirmPasswdvalidation(ConfirmPasswordValidation.err_display);
    } else if (ConfirmPasswordValidation.input === 'deosnotmatch') {
      setConfirmPasswdvalidation(ConfirmPasswordValidation.err_display);
    }

    if (
      NewPasswordValidation.validition &&
      ConfirmPasswordValidation.validition === true
    ) {
      let NewPswd = {
        token: user_token,
        password: confirm_password,
      };
      CreateNewPasswordHandler(NewPswd);
    }
  };

  const handleNewPassEyeIcon = () => {
    setNewpasswordState(!passworNewdState);
  };

  const handleConfirmPassEyeIcon = () => {
    setConfirmpasswordState(!passworConfirmdState);
  };
  return (
    <>
      <SafeAreaView>
        <ScrollView style={styles.main}>
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
            <Text style={styles.signintext}>Create New Password</Text>
          </View>
          <View style={{paddingBottom: 15}}>
            <Text style={styles.label}>
              New Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#ccc"
              onChange={onPassewordChange}
              secureTextEntry={passworNewdState}
            />
            {passwordvalidation ? (
              <ErrorLabel ErrorDisplay={passwordvalidation} />
            ) : null}
            {passworNewdState ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleNewPassEyeIcon()}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleNewPassEyeIcon()}>
                <Image source={require('../assets/eye.png')}></Image>
              </TouchableOpacity>
            )}
          </View>

          <View>
            <Text style={styles.label}>
              Confirm Password* <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              onChange={onConfirmPassword}
              secureTextEntry={passworConfirmdState}
            />
            {comfirmPasswdValidatoion ? (
              <ErrorLabel ErrorDisplay={comfirmPasswdValidatoion} />
            ) : null}
            {passworConfirmdState ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleConfirmPassEyeIcon()}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleConfirmPassEyeIcon()}>
                <Image source={require('../assets/eye.png')}></Image>
              </TouchableOpacity>
            )}
          </View>

          <View>
            <TouchableOpacity style={styles.submitbtn} onPress={HandleSubmit}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#000',
    paddingHorizontal: 5,
    minHeight: '100%',
  },
  logo: {
    width: 135,
    height: 117,
    padding: 20,
  },
  logosection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 40,
  },
  input: {
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25);',
    color: '#fff',
    // marginBottom: 20,
    flex: 1,
    borderRadius: 5,
    fontFamily: 'Montserrat-Medium',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  required: {
    color: '#eee',
  },
  signintext: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginVertical: 15,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 30,
  },
  required: {
    color: '#E66100',
  },
  forgottext: {
    color: '#fff',
    flex: 1,
    textAlign: 'right',
    color: '#E66100',
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  submitbtn: {
    backgroundColor: '#E66100',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    fontFamily: 'Montserrat-Bold',
  },
  submitbtntext: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  loginwith: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
  },
  socialsection: {
    flex: 2,
    flexDirection: 'row',
  },
  socialmain: {
    marginHorizontal: 10,
  },
  registersection: {
    backgroundColor: '#fff',
    flex: 2,
    flexDirection: 'row',
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
  },
  regtext1: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  regtext2: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
  regbtn: {
    backgroundColor: '#E66100',
    paddingVertical: 10,
    marginTop: 0,
    borderRadius: 5,
    marginLeft: 20,
  },
  regbtntext: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    width: 100,
    fontWeight: '700',
    fontFamily: 'Montserrat-Medium',
  },
  noaccountmain: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 50,
  },
  noaccount: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  signuptext: {
    color: '#E66100',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat-Medium',
  },
  eyeicon: {
    position: 'absolute',
    right: 10,
    zIndex: 9999,
    top: 37,
  },
});

export default CreateNewPassword;
