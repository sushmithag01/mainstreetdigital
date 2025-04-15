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
import styles from '../Common.css';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ResetPasswordAPI} from '../Utils/Api/ResetPasswordAPi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {removeUserData} from '../Utils/LocalStorage';
import {Snackbar} from 'react-native-paper';
import Loader from '../Utils/Loader';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {ConfirmPasswordCheck, PasswordCheck} from '../Utils/Validations';

const ResetPassword = props => {
  const passwordCond =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
  const ErrorMsg =
    'Should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character!';
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [oldPw, setoldPw] = useState('');
  const [newPw, setnewPw] = useState('');
  const [confirmPw, setconfirmPw] = useState('');
  const [showOldPW, setShowOldPw] = useState(true);
  const [showNewPW, setShowNewPW] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);
  // ERR
  const [oldPwErr, setoldPwErr] = useState('');
  const [newPwErr, setnewPwErr] = useState('');
  const [confirmPwErr, setconfirmPwErr] = useState('');
  const [matchPwErr, setmatchPwErr] = useState('');

  const [toastMsg, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [oldPwdValidation, setOldPwdValidation] = useState(false);
  const [newPwdValidation, setNewPwdValidation] = useState(false);
  const [confirmPwdValidation, setconfirmPwdValidation] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (isFocused) {
      setLoading(false);
    }
  }, []);
  // handleInput
  const handleChange = (value, event) => {
    if (value == 'oldPw') {
      setoldPw(event.nativeEvent.text);
      setnewPwErr('');
      setconfirmPwErr('');
      setmatchPwErr('');
      setoldPwErr('')
      if (event.nativeEvent.text.length == 0) {
        setoldPwErr('Old password is required!');
      }
      //  else {
      //   const olPasswordValidation = PasswordCheck(event.nativeEvent.text);
      //   if (olPasswordValidation.err_display) {
      //     setoldPwErr(olPasswordValidation.err_display);
      //     setOldPwdValidation('');
      //   } else {
      //     setOldPwdValidation(olPasswordValidation.validition);
      //     setoldPwErr('');
      //   }
      // }
    }
    if (value == 'newPw') {
      setnewPw(event.nativeEvent.text);
      if (event.nativeEvent.text.length === 0) {
        setnewPwErr('New password is required!');
      } else {
        const CreatePasswordValidation = PasswordCheck(event.nativeEvent.text);
        if (CreatePasswordValidation.err_display) {
          setnewPwErr(CreatePasswordValidation.err_display);
          setNewPwdValidation('');
        } else {
          setNewPwdValidation(CreatePasswordValidation.validition);
          setnewPwErr('');
        }
      }
    }
    if (value == 'confirmPw') {
      setconfirmPw(event.nativeEvent.text);
      if (confirmPw.length == 0) {
        setconfirmPwErr('Confirm password is required!');
      } else {
        const ConfirmPasswordValidation = ConfirmPasswordCheck(
          newPw,
          event.nativeEvent.text,
        );
        if (ConfirmPasswordValidation.err_display) {
          setconfirmPwErr(ConfirmPasswordValidation.err_display);
          setconfirmPwdValidation('');
        } else {
          setconfirmPwdValidation(ConfirmPasswordValidation.validition);
          setconfirmPwErr('');
        }

        // console.log("ConfirmPasswordValidation", ConfirmPasswordValidation)
      }
    }
  };
  const handleSave = async () => {
    if (!oldPw) {
      setoldPwErr('Old password is required!');
    } else {
      setoldPwErr('');
    }
    if (!newPw) {
      setnewPwErr('New password is required!');
    } else {
      setnewPwErr('');
    }
    if (!confirmPw) {
      setconfirmPwErr('Confirm password is required!');
    } else {
      setconfirmPwErr('');
    }
    if (newPwdValidation && confirmPwdValidation) {
      setLoading(true);
      const userTOKEN = await AsyncStorage.getItem('token');
      const data = {
        user_id: await AsyncStorage.getItem('userId'),
        old_password: oldPw,
        new_password: newPw,
        confirm_password: confirmPw,
      };
      const Response = await ResetPasswordAPI(data);
      setLoading(false);
      if (Response.status === 200) {
        removeUserData();
        setoldPw('');
        setnewPw('');
        setconfirmPw('');
        Toast.show(
          'Password updated successfully,try to login with updated password..!! ',
          {
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
          },
        );
        // navigation.navigate("SignIn");
      } else {
        if (
          Response.message === 'Token is invalid!' ||
          Response.message === 'Request failed with status code 403'
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
        } else if (Response.status === 429) {
          navigation.navigate('MyProfile');
          Toast.show(Response.message, {
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
          Toast.show(Response.message, {
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
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <SafeAreaView>
        <ScrollView
          style={styles.mainform}
          keyboardShouldPersistTaps={'handled'}>
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
          <View>
            <Text style={styles.orangetitletext}>Reset Password</Text>
          </View>
          <View style={styles.space20}></View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Old Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Old Password"
              placeholderTextColor="#ccc"
              secureTextEntry={showOldPW ? true : false}
              value={oldPw}
              onChange={event => {
                handleChange('oldPw', event);
              }}
            />
            {showOldPW ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowOldPw(!showOldPW)}>
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={22}
                  color="#E66100"></MaterialCommunityIcons>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowOldPw(!showOldPW)}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            )}
            {oldPwErr && (
              <Text style={styles.Errlabel_font_size}>{oldPwErr}</Text>
            )}
          </View>
          <View style={{marginBottom: 20, marginTop: 20}}>
            <Text style={[styles.label, styles.blacktext]}>
              New Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter New Password"
              placeholderTextColor="#ccc"
              secureTextEntry={showNewPW ? true : false}
              value={newPw}
              onChange={event => {
                handleChange('newPw', event);
              }}
            />
            {showNewPW ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowNewPW(!showNewPW)}>
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={22}
                  color="#E66100"></MaterialCommunityIcons>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowNewPW(!showNewPW)}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            )}
            {newPwErr && (
              <Text style={styles.Errlabel_font_size}>{newPwErr}</Text>
            )}
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry={showConfirmPW ? true : false}
              value={confirmPw}
              onChange={event => {
                handleChange('confirmPw', event);
              }}
            />
            {showConfirmPW ? (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowConfirmPW(!showConfirmPW)}>
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={22}
                  color="#E66100"></MaterialCommunityIcons>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eyeicon}
                onPress={() => setShowConfirmPW(!showConfirmPW)}>
                <Image source={require('../assets/eye-close.png')}></Image>
              </TouchableOpacity>
            )}
            {confirmPwErr && (
              <Text style={styles.Errlabel_font_size}>{confirmPwErr}</Text>
            )}
            {matchPwErr && (
              <Text style={styles.Errlabel_font_size}>{matchPwErr}</Text>
            )}
          </View>
          <View>
            <TouchableOpacity style={styles.submitbtn} onPress={handleSave}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              style={[styles.closebtn, styles.orgoutline]}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.closebtntext, styles.orgtext]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space20}></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default ResetPassword;
