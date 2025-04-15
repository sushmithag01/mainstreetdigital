import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {CheckBox} from '@rneui/themed';
import styles from '../Common.css';
import {
  EmailCheck,
  formatPhoneNumber,
  validatePhoneNumber,
} from '../Utils/Validations';
import ErrorLabel from './ErrorLabel';
import Toast from 'react-native-root-toast';
import {ForgotPasswordApi} from '../Utils/Api/ForgotPasswordApi';
import {Snackbar} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPassword = ({}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [selectedIndex, setIndex] = useState(1);
  const [mobileNumber, setMobileNumnber] = useState('');
  const [mobileValidation, setMobileValidation] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailValidation, setEmailValidation] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [responseData, setresponsedata] = useState([]);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        header: props => (
          <>
            <View style={[styles.headerhomesingleblack]}>
              <TouchableOpacity
                style={[
                  styles.backbtnmain,
                  styles.backinnert,
                  styles.chatsingle,
                ]}
                onPress={() => navigation.navigate('SignIn')}>
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
    }
  }, [isFocused]);

  const onEmail = event => {
    setEmailId(event.nativeEvent.text);
    setEmailValidation('');
  };

  // const onMobileChange = (event) => {
  //   setMobileNumnber(event.nativeEvent.text);
  //   setMobileValidation("");
  // }
  const onMobileChange = event => {
    let formattedValue = formatPhoneNumber(event.nativeEvent.text);
    setMobileNumnber(formattedValue);
    if (!validatePhoneNumber(formattedValue)) {
      setMobileValidation('Please enter a valid mobile number!');
    } else {
      setMobileValidation('');
    }
  };
  // 6755665445 - dfdfe@gma.com
  const ForgotPasswordHandler = async ForgotPsswordCredentials => {
    const forgotpassword = await ForgotPasswordApi(ForgotPsswordCredentials);
    console.log(forgotpassword, 'forgotpassword');
    if (forgotpassword.status === 200) {
      // setresponsedata(forgotpassword);
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
      navigation.navigate('Otp', {
        state: {
          userId: forgotpassword.user_id,
          userToken: forgotpassword.token,
          forgot_pwd_input: ForgotPsswordCredentials,
        },
      });
    } else {
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

  const SubmitHandler = event => {
    event.preventDefault();

    if (selectedIndex === 0) {
      if (mobileNumber.length === 0) {
        setMobileValidation('Mobile number is required!');
      } else if (mobileValidation === '' && mobileNumber.length !== 0) {
        const mobile_number = mobileNumber.replace(/-/g, '');
        let ForgetPassword_API_Details = {
          check: 2,
          forgot_pwd_input: parseInt(mobile_number),
        };
        console.log(ForgetPassword_API_Details, 'ForgetPassword_API_Details');
        ForgotPasswordHandler(ForgetPassword_API_Details);
      }
    } else {
      const EmailValidation = EmailCheck(emailId);
      if (EmailValidation.input === 'empty') {
        setEmailValidation(EmailValidation.err_display);
      } else if (EmailValidation.input === 'invalid') {
        setEmailValidation(EmailValidation.err_display);
      }

      if (selectedIndex === 1 && EmailValidation.validition === true) {
        let ForgetPassword_API_Details = {check: 1, forgot_pwd_input: emailId};
        ForgotPasswordHandler(ForgetPassword_API_Details);
      }
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView style={styles.main}>
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
              <Text style={styles.signintext}>Forgot Password</Text>
              <Text style={styles.receive}>Recieve a verification Code </Text>
            </View>
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#E66100"
              uncheckedColor="#E66100"
              title="Via Registered Email Address"
              containerStyle={styles.radio}
            />
            <View>
              <Text style={styles.loginwith}>Or</Text>
            </View>
            <CheckBox
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#E66100"
              title="Via Registered Mobile Number"
              containerStyle={styles.radio}
            />
            <View style={styles.space}></View>
            {selectedIndex === 1 ? (
              <View>
                <Text style={styles.label}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email Address"
                  placeholderTextColor="#ccc"
                  onChange={onEmail}
                  value={emailId}
                />
                {emailValidation ? (
                  <ErrorLabel ErrorDisplay={emailValidation} />
                ) : null}
              </View>
            ) : (
              <View>
                {/* <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text></Text> */}
                <Text style={styles.label}>
                  Mobile Number <Text style={styles.required}>*</Text>{' '}
                  <Text style={styles.infoTextSpaceWhite}>
                    &#40;Numbers only. No dash (-) or dot(.) between
                    numbers&#41;
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
                    // onChange={onMobileChange}
                    // value={mobileNumber}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#ccc"
                    onChange={onMobileChange}
                    value={mobileNumber}
                  />
                </View>

                {mobileValidation ? (
                  <ErrorLabel ErrorDisplay={mobileValidation} />
                ) : null}
              </View>
            )}

            <View>
              <TouchableOpacity
                style={styles.submitbtn}
                onPress={SubmitHandler}>
                <Text style={styles.submitbtntext}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// const styles = StyleSheet.create({
//   main:{
//     backgroundColor:"#000",
//     paddingHorizontal:5,
//     minHeight:"100%"
//   },
//   logo:{
//     width:135,
//     height:117,
//     padding:20
//   },
//   logosection:{
//     flex:1,
//     flexDirection:"row",
//     justifyContent:"center",
//     alignContent:"center",
//     marginTop:40
//   },
//   input: {
//     height: 40,
//     marginVertical: 5,
//     borderWidth: 1,
//     padding: 10,
//     backgroundColor:"rgba(255, 255, 255, 0.25);",
//     color:"#fff",
//     marginBottom:20,
//     flex:1,
//     borderRadius:5
//   },
//   label:{
//     color:"#fff",
//     fontSize:17
//   },
//   required:{
//     color:"#eee"
//   },
//   signintext:{
//     textAlign:"center",
//     fontSize:18,
//     color:"#fff",
//     marginVertical:15,
//     fontWeight:'700'
//     // fontFamily: 'Montserrat-Regular'
//   },
//   required:{
//     color:"#E66100"
//   },
//   forgottext:{
//     color:"#fff",
//     flex:1,
//     textAlign:"right",
//     color:"#E66100",
//     fontSize:15
//   },
//   submitbtn:{
//     backgroundColor:"#E66100",
//     paddingVertical:10,
//     marginTop:10,
//     borderRadius:5
//   },
//   submitbtntext:{
//     color:"#fff",
//     textAlign:"center",
//     fontSize:18,
//     fontWeight:'700'
//   },
//   loginwith:{
//     color:"#fff",
//     textAlign:"center",
//     marginVertical:10,
//     fontSize:18
//   },
//   socialsection:{
//     flex:2,
//     flexDirection:"row"
//   },
//   socialmain:{
//     marginHorizontal:10
//   },
//   registersection:{
//     backgroundColor:"#fff",
//     flex:2,
//     flexDirection:"row",
//     marginVertical:20,
//     padding:20,
//     borderRadius:10
//   },
//   regtext1:{
//     fontSize:16
//   },
//   regtext2:{
//     fontSize:20,
//     fontWeight:'700'
//   },
//   regbtn:{
//     backgroundColor:"#E66100",
//     paddingVertical:10,
//     marginTop:0,
//     borderRadius:5,
//     marginLeft:20
//   },
//   regbtntext:{
//     color:"#fff",
//     textAlign:"center",
//     fontSize:18,
//     width:100,
//     fontWeight:'700'
//   },
//   noaccountmain:{
//     flex:2,
//     flexDirection:"row",
//     justifyContent:"center",
//     marginTop:0,
//     marginBottom:50
//   },
//   noaccount:{
//     color:"#fff",
//     fontSize:16,
//   },
//   signuptext:{
//     color:"#E66100",
//     fontSize:16,
//     fontWeight:'700'
//   },
//   eyeicon:{
//     position:"absolute",
//     right:10,
//     zIndex:9999,
//     top:37
//   },
//   receive:{
//     color:"#fff",
//     textAlign:"center",
//     fontSize:17,
//     marginBottom:30,
//     marginTop:10
//   },
//   radio:{
//     backgroundColor:"#000",
//     color:"#fff",
//     opacity:1
//   },
//   space:{
//     height:20
//   }
// });

export default ForgotPassword;
