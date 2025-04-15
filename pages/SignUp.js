import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import styles from '../Common.css';
import {
  FirstNameCheck,
  LastNameCheck,
  EmailCheck,
  PasswordCheck,
  ConfirmPasswordCheck,
  formatPhoneNumber,
  validatePhoneNumber,
} from '../Utils/Validations';
import ErrorLabel from './ErrorLabel';
import {SignUpApi} from '../Utils/Api/SignUpApi';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GraphRequestManager,
  LoginManager,
  GraphRequest,
} from 'react-native-fbsdk-next';
import {SocialLoginApi} from '../Utils/Api/SocialLoginApi';
import {setUserCredentials} from '../Utils/LocalStorage';
import {
  BUSSINESS_REGISTER_URL,
  PRIVACYPOLICY_URL,
  TERMSANDCONDITION_URL,
} from '../Utils/Constants';
import Toast from 'react-native-root-toast';
import {Snackbar} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import moment from 'moment-timezone';
import {CheckBox} from '@rneui/themed';

const SignUp = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [firstName_vald, setFirstNameVald] = useState('');
  const [eu_first_name, setFirstName] = useState('');
  const [lastName_vald, setLastNameVald] = useState('');
  const [eu_last_name, setLastName] = useState('');
  const [email_vald, setEmailVald] = useState('');
  const [eu_email, setEmail] = useState('');
  const [mobile_vald, setMobileVald] = useState('');
  const [eu_mobile_num, setMobileNum] = useState('');
  const [password_vald, setPasswordVald] = useState('');
  const [eu_password, setPassword] = useState('');
  const [confirm_password_vald, setConfirmPasswordVald] = useState('');
  const [eu_confirm_password, setConfirmPassword] = useState('');
  const [passwordState, setpasswordState] = useState(true);
  const [ConfirmPasswordState, setConfirmPassState] = useState(true);
  const [toastMsg, setToastMessage] = useState('');
  const [iAgree, setIAgree] = useState(false);
  const [iAgreeVald, setIAgreeVald] = useState('');

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const currentTimeZone = moment.tz.guess();

  const onFirstName = event => {
    const filteredFirstName = event.nativeEvent.text.replace(/[^a-zA-Z0-9]/g, '')
    setFirstName(filteredFirstName);
    setFirstNameVald('');
  };
  const onLastName = event => {
    const filteredLasttName = event.nativeEvent.text.replace(/[^a-zA-Z0-9]/g, '')
    setLastName(filteredLasttName);
    setLastNameVald('');
  };
  const onEmail = event => {
    setEmail(event.nativeEvent.text);
    setEmailVald('');
  };
  // const onMobileChange = (event) => {
  //   setMobileNum(event.nativeEvent.text);
  //   setMobileVald("");
  // }
  const onMobileChange = event => {
    let formattedValue = formatPhoneNumber(event.nativeEvent.text);
    setMobileNum(formattedValue);
    if (!validatePhoneNumber(formattedValue)) {
      setMobileVald('Please enter a valid mobile number!');
    } else {
      setMobileVald('');
    }
  };
  const OnPassword = event => {
    setPassword(event.nativeEvent.text);
    setPasswordVald('');
  };
  const OnConfirmPassword = event => {
    setConfirmPassword(event.nativeEvent.text);
    setConfirmPasswordVald('');
  };
  const SignUpHandler = async SignUpCredentials => {
    const SignUpStatus = await SignUpApi(SignUpCredentials);
    console.log('SignUpStatus', SignUpStatus);
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
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobileNum('');
      setPassword('');
      setConfirmPassword('');
      setFirstNameVald('');
      setLastNameVald('');
      setEmailVald('');
      setMobileVald('');
      setPasswordVald('');
      setConfirmPasswordVald('');
      navigation.navigate('Otp', {
        state: {
          pageName: 'SignupVerification',
          SignUpCredentials: SignUpCredentials,
        },
      });
    } else {
      if (
        SignUpStatus.eu_status ===
        'Duplicate entry ' +
          "'" +
          eu_email +
          "'" +
          " for key 'end_user.eu_email_UNIQUE'"
      ) {
        Toast.show('Email already exists...!!!', {
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
    }

    // console.ErrorDisplay(SignUpStatus);
  };
  const handleEyeIcon = () => {
    setpasswordState(!passwordState);
  };
  const handleConfirmEyeIcon = () => {
    setConfirmPassState(!ConfirmPasswordState);
  };

  const HandleSignUp = event => {
    event.preventDefault();
    const FirstNameValidation = FirstNameCheck(eu_first_name);
    const LastNameValidation = LastNameCheck(eu_last_name);
    const EmailValidation = EmailCheck(eu_email);
    // const MobileNumberValidation = MobileNumberCheck(eu_mobile_num);
    const CreatePasswordValidation = PasswordCheck(eu_password);
    const ConfirmPasswordValidation = ConfirmPasswordCheck(
      eu_password,
      eu_confirm_password,
    );
    if (FirstNameValidation.input === 'empty') {
      setFirstNameVald(FirstNameValidation.err_display);
    } else if (FirstNameValidation.input === 'invalid') {
      setFirstNameVald(FirstNameValidation.err_display);
    }
    if (LastNameValidation.input === 'empty') {
      setLastNameVald(LastNameValidation.err_display);
    } else if (LastNameValidation.input === 'invalid') {
      setLastNameVald(LastNameValidation.err_display);
    }
    if (EmailValidation.input === 'empty') {
      setEmailVald(EmailValidation.err_display);
    } else if (EmailValidation.input === 'invalid') {
      setEmailVald(EmailValidation.err_display);
    }
    // if (MobileNumberValidation.input === "empty") {
    //   setMobileVald(MobileNumberValidation.err_display);
    // } else if (MobileNumberValidation.input === "invalid") {
    //   setMobileVald(MobileNumberValidation.err_display);
    // }
    if (eu_mobile_num.length === 0) {
      setMobileVald('Mobile number is required!');
  
    }
  
    if (CreatePasswordValidation.input === 'empty') {
      setPasswordVald(CreatePasswordValidation.err_display);
    } else if (CreatePasswordValidation.input === 'lesscharacters') {
      setPasswordVald(CreatePasswordValidation.err_display);
    } else if (CreatePasswordValidation.input === 'invalid') {
      setPasswordVald(CreatePasswordValidation.err_display);
    }
    if (ConfirmPasswordValidation.input === 'empty') {
      setConfirmPasswordVald('Confirm the Password!');
    } else if (ConfirmPasswordValidation.input === 'deosnotmatch') {
      setConfirmPasswordVald('Password did not match!');
    }
    if (iAgree) {
      setIAgreeVald(true);
    } else {
      setIAgreeVald('Please agree to the privacy policy,terms and conditions.');
    }
    if (
      FirstNameValidation.validition &&
      LastNameValidation.validition &&
      EmailValidation.validition &&
      CreatePasswordValidation.validition &&
      ConfirmPasswordValidation.validition === true &&
      mobile_vald === '' &&
      eu_mobile_num.length !== 0 &&
      iAgreeVald=== true
    ) {
     
      const mobile_number = eu_mobile_num.replace(/-/g, '');
      let SignUpDetails = {
        eu_first_name: eu_first_name,
        eu_last_name: eu_last_name,
        eu_email: eu_email,
        eu_contact_number: parseInt(mobile_number),
        eu_password: eu_confirm_password,
        type: 1,
        time_zone: currentTimeZone,
      };
      console.log(SignUpDetails, 'SignUpDetails');

      SignUpHandler(SignUpDetails);
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
      }
    }
  };
  // const facebookSignIn = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       'public_profile',
  //       'email'
  //     ]);
  //     if (result.isCancelled) {
  //       throw new Error('Login canceled');
  //     } else {
  //       const data = await AccessToken.getCurrentAccessToken();
  //       console.log("data facebook is", data)
  //     }
  //   } catch (error) {
  //   }
  // };

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
                fontWeight:"500" // Increase the font size here
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
            fontWeight:"500" // Increase the font size here
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
            fontWeight:"500" // Increase the font size here
          },
        });
      }
    } else {
      const payload = {
        email: data,
        is_mobile: 1,
      };
      console.log('sociallogin false', payload);
      const sociallogin = await SocialLoginApi(payload);
      console.log('sociallogin', sociallogin);
      if (sociallogin.status === 200) {
        //Toast Message
        // setUserCredentials(sociallogin);
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
            fontWeight:"500" // Increase the font size here
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
            fontWeight:"500" // Increase the font size here
          },
        });
      }
    }
  };
  const handleRegisterBusiness = () => {
    Linking.openURL(BUSSINESS_REGISTER_URL).catch(err =>
      console.error('An error occurred', err),
    );
  };

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    // console.log(appleAuthRequestResponse,"appleAuthRequestResponse")
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
          fontWeight:"500" // Increase the font size here
        },
      });
    }
  }

  const handleLinks = data => {
    if (data === 'privacypolicy') {
      Linking.openURL(PRIVACYPOLICY_URL).catch(err =>
        console.error('An error occurred', err),
      );
    } else {
      Linking.openURL(TERMSANDCONDITION_URL).catch(err =>
        console.error('An error occurred', err),
      );
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          style={styles.main}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
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
            <View style={styles.logosection}>
              <Image
                source={require('../assets/Logo-new.png')}
                style={styles.logo}
              />
            </View>
            <View>
              <Text style={styles.signintext}>Customer Sign Up </Text>
            </View>
            <View style={styles.formmain}>
              <Text style={styles.label}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter First Name"
                placeholderTextColor="#ccc"
                value={eu_first_name}
                onChange={onFirstName}
                autoComplete="off"
              />
              {firstName_vald ? (
                <ErrorLabel ErrorDisplay={firstName_vald} />
              ) : null}
            </View>
            <View style={styles.formmain}>
              <Text style={styles.label}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Last Name"
                placeholderTextColor="#ccc"
                value={eu_last_name}
                onChange={onLastName}
                autoComplete="off"
              />
              {lastName_vald ? (
                <ErrorLabel ErrorDisplay={lastName_vald} />
              ) : null}
            </View>
            <View style={styles.formmain}>
              <Text style={styles.label}>
                Email Address<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email Address"
                placeholderTextColor="#ccc"
                value={eu_email}
                onChange={onEmail}
                autoCapitalize="none"
                autoComplete="off"
              />
              {email_vald ? <ErrorLabel ErrorDisplay={email_vald} /> : null}
            </View>
            <View style={styles.formmain}>
              <Text style={styles.label}>
                Mobile Number <Text style={styles.required}>*</Text>{' '}
                <Text style={styles.infoTextSpaceWhite}>
                  &#40;Numbers only. No dash (-) or dot(.) between numbers and
                  we protect your information,{' '}
                  <TouchableOpacity
                    onPress={() => handleLinks('privacypolicy')}>
                    <Text style={styles.privacyPolicy}>our Privacy Policy</Text>
                  </TouchableOpacity>
                  &#41;
                </Text>
              </Text>
              <View
                style={{
                  justifyContent: 'space-around',
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <TextInput
                  style={styles.Countryinput}
                  placeholder="+1"
                  placeholderTextColor="#ccc"
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#ccc"
                  onChange={onMobileChange}
                  value={eu_mobile_num}
                  keyboardType="numeric"
                  autoComplete="off"
                />
              </View>
              {mobile_vald ? <ErrorLabel ErrorDisplay={mobile_vald} /> : null}
            </View>
            <View style={styles.formmain}>
              <Text style={styles.label}>
                Create Password <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Type a new password"
                placeholderTextColor="#ccc"
                onChange={OnPassword}
                value={eu_password}
                secureTextEntry={passwordState}
                autoCapitalize="none"
                autoComplete="off"
              />
              {password_vald != '' ? (
                <ErrorLabel ErrorDisplay={password_vald} />
              ) : null}
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
              <Text style={styles.label}>
                Confirm Password <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#ccc"
                onChange={OnConfirmPassword}
                value={eu_confirm_password}
                secureTextEntry={ConfirmPasswordState}
                autoCapitalize="none"
                autoComplete="off"
              />
              {confirm_password_vald != '' ? (
                <ErrorLabel ErrorDisplay={confirm_password_vald} />
              ) : null}
              {ConfirmPasswordState ? (
                <TouchableOpacity
                  style={styles.eyeicon}
                  onPress={() => handleConfirmEyeIcon()}>
                  <Image source={require('../assets/eye-close.png')}></Image>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.eyeicon}
                  onPress={() => handleConfirmEyeIcon()}>
                  <Image source={require('../assets/eye.png')}></Image>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'flex-start',
                marginTop: 15,
              }}>
              <CheckBox
                checked={iAgree}
                iconType="material-community"
                checkedIcon="checkbox-marked"
                uncheckedIcon={'checkbox-blank'}
                containerStyle={styles.checkmainSignup}
                checkedColor="#E66100"
                onPress={() => setIAgree(!iAgree)}
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.privacyTandCText1}>I agree to </Text>
                <Text
                  style={styles.privacyTandCText}
                  onPress={() => handleLinks('privacypolicy')}>
                  Privacy Policy
                </Text>
                <Text style={styles.privacyTandCText1}>and</Text>
                <Text
                  style={[styles.privacyTandCText, {paddingHorizontal: 5}]}
                  onPress={() => handleLinks('terms')}>
                  Terms & Conditions
                </Text>
              </View>
            </View>
            {iAgreeVald ? <ErrorLabel ErrorDisplay={iAgreeVald} /> : null}
            <View>
              <TouchableOpacity
                style={styles.submitbtn}
                onPress={event => HandleSignUp(event)}>
                <Text style={styles.submitbtntext}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            {/* <View>
              <Text style={styles.loginwith}>Or Login with</Text>
            </View>
            <View style={styles.socialsection}>
              {Platform.OS === 'ios' ?
                <View style={styles.socialmain}>
                  <TouchableOpacity onPress={() => onAppleButtonPress()}>
                    <Image source={require('../assets/i-login.png')} style={{ width: 100, borderRadius: 5 }}></Image>
                  </TouchableOpacity>
                </View>
                : ""}
              <View style={styles.socialmain}>
                <TouchableOpacity onPress={() => GooglesignIn()}>
                  <Image source={require('../assets/g-login.png')} style={Platform.OS === 'ios' ? { width: 100, borderRadius: 5 } : ""}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.socialmain}>
                <TouchableOpacity onPress={() => facebookSignIn()}>
                  <Image source={require('../assets/f-login.png')} style={Platform.OS === 'ios' ? { width: 100, borderRadius: 5 } : ""}></Image>
                </TouchableOpacity>
              </View>
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
              <Text style={styles.noaccount}>Have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signuptext}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default SignUp;
