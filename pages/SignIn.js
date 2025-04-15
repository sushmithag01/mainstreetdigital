import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import styles from '../Common.css';
import { SignInApi } from '../Utils/Api/SignInApi';
import { EmailCheck } from '../Utils/Validations';
import ErrorLabel from './ErrorLabel';
import { useIsFocused } from '@react-navigation/native';
import {
  BUSSINESS_REGISTER_URL,
  PRIVACYPOLICY_URL,
  TERMSANDCONDITION_URL,
} from '../Utils/Constants';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { SocialLoginApi } from '../Utils/Api/SocialLoginApi';
import { setUserCredentials } from '../Utils/LocalStorage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import Toast from 'react-native-root-toast';
import { Snackbar } from 'react-native-paper';
import {
  GraphRequestManager,
  LoginManager,
  GraphRequest,
} from 'react-native-fbsdk-next';
import Loader from '../Utils/Loader';

const SignIn = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [email_vald, setEmailVald] = useState('');
  const [eu_email, setEmail] = useState('');
  const [password_vald, setPasswordVald] = useState('');
  const [eu_password, setPassword] = useState('');
  const [passwordState, setpasswordState] = useState(true);
  const [toastMsg, setToastMessage] = useState('');
  const [errorLable, setErrorLabel] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("user_info",user_info)
  useEffect(() => {
    if (isFocused) {
      GoogleSignin.configure({
        androidClientId:
          '317991843833-a0k3qvfivehtk7k5ttfj5ltghmbl827s.apps.googleusercontent.com',
        webClientId:
          '317991843833-r6jc27f4l18c1l5m4ul3dnh439gsburv.apps.googleusercontent.com',
        offlineAccess: true,
      });
      setEmail('');
      setPassword('');
    }
  }, []);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const onEmail = event => {
    setEmail(event.nativeEvent.text);
    setEmailVald('');
  };
  const handleRegisterBusiness = () => {
    Linking.openURL(BUSSINESS_REGISTER_URL).catch(err =>
      console.error('An error occurred', err),
    );
  };
  const OnPassword = event => {
    setPassword(event.nativeEvent.text);
    setPasswordVald('');
  };
  const LoginHandler = async LoginCredentials => {
    const userLoginData = await SignInApi(LoginCredentials);
    if (userLoginData.eu_status === 'User successfully logged in') {
      setUserCredentials(userLoginData);
      Toast.show('Successfully logged in', {
        duration: 6000,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000000',
        textStyle: {
          fontSize: 18,
          fontWeight: "500" // Increase the font size here
        },
      });
      if (userLoginData.is_new_user === true) {
        navigation.navigate('WelcomeScreen')
      } else {
        navigation.navigate('Home');
      }
      setEmail('');
      setPassword('');
    } else {
      Toast.show(userLoginData.eu_status, {
        duration: 6000,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000000',
        textStyle: {
          fontSize: 18,
          fontWeight: "500" // Increase the font size here
        },
      });
    }
  };
  const handleEyeIcon = () => {
    setpasswordState(!passwordState);
  };
  const HandelSignIn = event => {
    event.preventDefault();
    const EmailValidation = EmailCheck(eu_email);
    if (EmailValidation.input === 'empty') {
      setEmailVald(EmailValidation.err_display);
    } else if (EmailValidation.input === 'invalid') {
      setEmailVald(EmailValidation.err_display);
    }
    if (eu_password == '') {
      setPasswordVald('Password is required!');
    }
    if (EmailValidation.validition && eu_password) {
      let LoginCredentials = {
        eu_email: eu_email,
        eu_password: eu_password,
        is_mobile: 1,
      };
      LoginHandler(LoginCredentials);
    } else {
      console.log('error');
    }
  };
  const GooglesignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        SocialLoginApiHandler(userInfo.user.email);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('Google sign in error', error);
      }
    }
  };
  const facebookSignIn = async () => {
    // try {
    //   const result = await LoginManager.logInWithPermissions([
    //     'public_profile',
    //     'email'
    //   ]);
    //   if (result.isCancelled) {
    //     throw new Error('Login canceled');
    //   } else {
    try {
      LoginManager.logOut();

      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'email,name',
            },
          },
        },
        (err, res) => {
          console.log(err, res);
          console.log('facebook response', res);
          if (res.email) {
            SocialLoginApiHandler(res.email);
          } else {
            Toast.show('User not found..!!', {
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
                fontWeight: "500" // Increase the font size here
              },
            });
          }
        },
      );
      LoginManager.setLoginBehavior('web_only');
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        function (result) {
          console.log('in facebookSignIn', result);
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        },
        function (error) {
          // Alert.alert(error)
          console.log('Login fail with error: ' + error);
        },
      );
    } catch (error) {
      console.log(error);
    }
    // }
    // } catch (error) {
    //   console.log("error", error);
    // }
  };
  const SocialLoginApiHandler = async data => {
    // setLoading(true)
    if (data.auth_token) {
      const payload = {
        auth_token: data.auth_token,
        is_mobile: 1,
      };
      const sociallogin = await SocialLoginApi(payload);
      console.log('sociallogin', sociallogin);
      if (sociallogin.status === 200) {
        //Toast Message
        setUserCredentials(sociallogin);
        Toast.show(sociallogin.eu_status, {
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
            fontWeight: "500" // Increase the font size here
          },
        });
        navigation.navigate('Home');
      } else {
        //Toast Message
        Toast.show(sociallogin.message, {
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
            fontWeight: "500" // Increase the font size here
          },
        });
      }
    } else {
      const payload = {
        email: data,
        is_mobile: 1,
      };
      // console.log("sociallogin false", payload);
      const sociallogin = await SocialLoginApi(payload);
      console.log('sociallogin', sociallogin);
      if (sociallogin.status === 200) {
        //Toast Message
        setUserCredentials(sociallogin);
        Toast.show(sociallogin.eu_status, {
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
            fontWeight: "500" // Increase the font size here
          },
        });
        navigation.navigate('Home');
      } else {
        //Toast Message
        Toast.show(sociallogin.message, {
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
            fontWeight: "500" // Increase the font size here
          },
        });
      }
    }
  };
  // // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  //   const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  //   // use credentialState response to ensure the user is authenticated
  //   if (credentialState === appleAuth.State.AUTHORIZED) {
  //     // user is authenticated
  //   }
  // }
  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (
      appleAuthRequestResponse.authorizationCode &&
      appleAuthRequestResponse.identityToken
    ) {
      // await AsyncStorage.setItem("apple_token", JSON.stringify(appleAuthRequestResponse.authorizationCode));
      // await AsyncStorage.setItem("apple_email", JSON.stringify(appleAuthRequestResponse.email));
      // await AsyncStorage.setItem("apple_response", JSON.stringify(appleAuthRequestResponse));
      let payload = {
        auth_token: appleAuthRequestResponse.identityToken,
        loginType: 'apple',
      };
      SocialLoginApiHandler(payload);
    } else {
      Toast.show('Something went wrong Please try again..!!', {
        duration: 6000,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
        opacity: 1,
        textStyle: {
          fontSize: 18,
          fontWeight: "500" // Increase the font size here
        },
      });
    }
  }

  const handleLinks = data => {
    if (data === 'privacypolicy') {
      Linking.openURL(PRIVACYPOLICY_URL).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(TERMSANDCONDITION_URL).catch(err => console.error('An error occurred', err));

    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : null}
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
                <Text style={{ color: '#000000', textAlign: 'center' }}>
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
            <Text style={styles.signintext}>Customer Login</Text>
          </View>
          <View style={styles.formmain}>
            <Text style={styles.label}>
              Email Address<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email Address"
              autoComplete="off"
              placeholderTextColor="#ccc"
              onChange={onEmail}
              value={eu_email}
              autoCapitalize="none"
            />
            {email_vald ? <ErrorLabel ErrorDisplay={email_vald} /> : null}
          </View>
          <View style={styles.formmain}>
            <Text style={styles.label}>
              Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              autoComplete="off"
              placeholderTextColor="#ccc"
              onChange={OnPassword}
              value={eu_password}
              secureTextEntry={passwordState}
              autoCapitalize="none"
            />
            {password_vald ? <ErrorLabel ErrorDisplay={password_vald} /> : null}
            {passwordState ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleEyeIcon()}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => handleEyeIcon()}>
                <Image source={require('../assets/eye.png')}></Image>
              </TouchableOpacity>
            )}
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgottext}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 30 }}></View>
          <View>
            <TouchableOpacity style={[styles.submitbtn]} onPress={HandelSignIn}>
              <Text style={styles.submitbtntext}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 20 }}></View>
          {/* <View>
            <Text style={styles.loginwith}>Or Login with</Text>
          </View>
          <View style={styles.socialsection}>
            {Platform.OS === 'ios' ? (
              <View style={styles.socialmain}>
                <TouchableOpacity onPress={() => onAppleButtonPress()}>
                  <Image
                    source={require('../assets/i-login.png')}
                    style={{width: 100, borderRadius: 5}}></Image>
                </TouchableOpacity>
              </View>
            ) : (
              ''
            )} 
            <View style={styles.socialmain}>
              <TouchableOpacity onPress={() => GooglesignIn()}>
                <Image
                  source={require('../assets/g-login.png')}
                  style={
                    Platform.OS === 'ios'
                      ? {width: 100, borderRadius: 5}
                      : {width: 100, borderRadius: 5}
                  }></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.socialmain}>
              <TouchableOpacity onPress={() => facebookSignIn()}>
                <Image
                  source={require('../assets/f-login.png')}
                  style={
                    Platform.OS === 'ios'
                      ? {width: 100, borderRadius: 5}
                      : {width: 100, borderRadius: 5}
                  }></Image>
              </TouchableOpacity>
            </View>
          </View> */}
          {/* {Platform.OS === 'ios' && <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: 160, // You must specify a width
                height: 45, // You must specify a height
              }}
              onPress={() => onAppleButtonPress()}
            />
          </View>
          } */}
          {/* <View style={{marginTop: 10, textAlign: 'center'}}>
            <Text style={styles.noaccount}>
              You can login with {Platform.OS === 'ios' ? 'Apple, ' : ''}Google
              or Facebook if you have used same e-mail address to sign up.
            </Text>
          </View> */}
          <View style={styles.registersection}>
            <View style={styles.regleft}>
              <Text style={styles.regtext1}>If you are business owner</Text>
              <Text style={styles.regtext2}>Register Your Business!</Text>
            </View>
            <View style={styles.regright}>
              <TouchableOpacity
                style={styles.regbtn}
                onPress={() => handleRegisterBusiness()}>
                <Text style={styles.regbtntext}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.noaccountmain}>
            <Text style={styles.noaccount}>Don’t have account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signuptext}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 50 }}>
            <Text
              style={styles.privacyTandCText}
              onPress={() => handleLinks('privacypolicy')}>
              Privacy Policy |
            </Text>
            <Text
              style={[styles.privacyTandCText, { paddingHorizontal: 5 }]}
              onPress={() => handleLinks('terms')}>
              Terms & Conditions
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default SignIn;
