import React, {useState, useEffect} from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ProfileApi} from '../Utils/Api/ProfileApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UpdateEditProfileAPI} from '../Utils/Api/UpdateEditProfile';
import {removeUserData} from '../Utils/LocalStorage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-root-toast';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../Utils/Loader';
import {launchImageLibrary} from 'react-native-image-picker';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {formatPhoneNumber} from '../Utils/Validations';
import {SHARE_LINK_URL} from '../Utils/Constants';

let check_apple_auth;
let user_id;
async function checkAppleUser() {
  check_apple_auth = await AsyncStorage.getItem('apple_token');
  user_id = await AsyncStorage.getItem('userId');
}
const MyProfile = ({props}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMessage] = useState('');
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [country_code, setCountryCode] = useState('+1');
  const [email, setEmail] = useState('');
  const [profileData, setProfileData] = useState('');
  const [profile_img, setProfileImg] = useState('');
  const [userId, setUserId] = useState('');
  // Err
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [filePath, setFilePath] = useState('');
  const [appleAuth, setAppleToken] = useState('');
  const [fileType, setfileType] = useState('');
  const [profileURL, setProfileUrl] = useState('');
  // get userInfo
  useEffect(() => {
    if (isFocused) {
      checkAppleUser()
        .then(() => {
          setAppleToken(check_apple_auth);
          setUserId(user_id);
        })
        .finally(() => {
          GetUserInfo();
        });
    }
  }, [isFocused]);

  const GetUserInfo = async () => {
    setLoading(true);
    const data = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    // console.log(data,"payload")
    const getInfo = await ProfileApi(data).finally(() => {
      setLoading(false);
    });
    if (getInfo.status === '404') {
      console.log('AsyncStorage', AsyncStorage.clear());
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
        textStyle: {
          fontSize: 18,
          fontWeight:"500" // Increase the font size here
        },
      });
    } else if (getInfo.status === 429) {
      Toast.show(getInfo.message, {
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
      navigation.navigate('Explore');
    } else if (
      getInfo.message === 'Token is invalid!' ||
      getInfo.message === 'Request failed with status code 403'
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
    } else if (getInfo && getInfo.length > 0 && getInfo[0].profile_image) {
      const filename = getInfo[0].profile_image;
      var parts = filename.split('/'); // Split the string into an array of strings by character /
      var first = parts.length - 3;
      var second = parts.length - 2;
      var three = parts.length - 1; // Determine the last word's 0-based index in array (length -1)
      var word1 = parts[first];
      var word2 = parts[second];
      var word3 = parts[three];
      setProfileUrl(word1 + '/' + word2 + '/' + word3);
    }
    setProfileData(getInfo ? getInfo[0] : '');
    setFirstName(getInfo[0].first_name);
    setLastName(getInfo[0].last_name);
    setMobile(formatPhoneNumber(getInfo[0].mobile_number));
    setEmail(getInfo[0].email_address);
    setProfileImg(getInfo[0].profile_image);
  };

  // handleInput
  const handleChange = (value, event) => {
    if (value === 'firstname') {
      const filteredFirstName= event.nativeEvent.text.replace(/[^a-zA-Z0-9]/g, '');
      setFirstName(filteredFirstName);
    }
    if (value === 'lastname') {
      const filteredLastName= event.nativeEvent.text.replace(/[^a-zA-Z0-9]/g, '');
      setLastName(filteredLastName);
    }
  };

  const handleSave = async () => {
    if (firstName.length == 0) {
      setFirstNameErr('First Name is required!');
    }
    if (lastName.length == 0) {
      setLastNameErr('Last Name is required!');
    }
    if (firstName.length && lastName.length != 0) {
      setFirstNameErr('');
      setLastNameErr('');
      const userID = await AsyncStorage.getItem('userId');
      const data = {
        first_name: firstName,
        last_name: lastName,
        user_id: userID,
        pro_img_change: 0,
        profile_image: profile_img ? profileURL : '',
      };
      const UpdateInfo = await UpdateEditProfileAPI(data);
      if (UpdateInfo.success == true) {
        Toast.show(UpdateInfo.message, {
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
        GetUserInfo();
        // navigation.navigate("MyProfile");
      } else if (UpdateInfo.status === 429) {
        Toast.show(UpdateInfo.message, {
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
        navigation.navigate('Explore');
      } else {
        Toast.show(UpdateInfo.message, {
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
  const handleLogOut = () => {
    setLoading(true);
    removeUserData()
      .then(() => {
        GooglesignOut();
        // AppleSignOut();
        // LoginManager.logOut();
        Toast.show('Logged Out Successfully', {
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
      })
      .finally(() => {
        setLoading(false);
        navigation.replace('SignIn');
      });
  };
  const GooglesignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const AppleSignOut = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation,
    });
    console
      .log('appleAuthRequestResponse', appleAuthRequestResponse)
      .catch(error => {
        console.log('Caught logout error..', error);
      });
  };
  const options = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.5,
    mediaType: 'photo',
    includeBase64: true,
    presentationStyle: 'pageSheet',
    cameraType: 'front',
  };
  // profile image upload
  const chooseGallery = async () => {
    const result = await launchImageLibrary(options);
    const filename = result.assets[0].fileName;
    var parts = filename.split('.'); // Split the string into an array of strings by character /
    var lastIndexOf = parts.length - 1; // Determine the last word's 0-based index in array (length -1)
    var file_type = parts[lastIndexOf];
    setfileType(file_type);
    if (result && result.assets[0].base64) {
      setFilePath(`data:image/jpeg;base64,${result.assets[0].base64}`);
      const payload = {
        first_name: firstName,
        last_name: lastName,
        user_id: await AsyncStorage.getItem('userId'),
        pro_img_change: 1,
        profile_image: {
          data: result.assets[0].base64 ? result.assets[0].base64 : '',
          file_type: file_type,
        },
      };
      const UpdateInfo = await UpdateEditProfileAPI(payload);
      // console.log('UpdateInfo',UpdateInfo,payload)
      if (UpdateInfo.success == true) {
        Toast.show('Profile photo updated successfully', {
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
        GetUserInfo();
      } else {
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
      }
    } else {
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
    }
  };

  // deleting user Account
  const handleDeleteAcc = async () => {
    navigation.navigate('DeleteConfirmation');
  };

  // console.log("filePath",filePath);

  const openSupportPage = () => {
    const url = `${SHARE_LINK_URL}support`;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const openEmailSupport = () => {
    const email = 'support@shoplocal.digital';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open email client:', err),
    );
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : null}
      <SafeAreaView>
        <ScrollView
          style={styles.mainform}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#fff',
              position: 'absolute',
              top: 0,
              width: '92%',
              zIndex: 999999,
              overflow: 'visible',
            }}></View>
          <View>
            <Text style={styles.orangetitletext}>MyProfile</Text>
          </View>
          <View style={styles.space20}></View>
          <TouchableOpacity onPress={() => chooseGallery()}>
            {loading ? (
              <Loader loading={loading} />
            ) : (
              <View style={[styles.profilelogosection]}>
                <Image
                  source={
                    profile_img
                      ? {uri: profile_img}
                      : {
                          uri: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
                        }
                  }
                  style={[styles.ProfileLogo, styles.addupload]}></Image>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formmain}>
            <Text style={[styles.label, styles.blacktext]}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            {/* <Text style={[styles.input, styles.blacktext]}>{firstName ? firstName : null}</Text> */}
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter First Name"
              placeholderTextColor="#ccc"
              editable={true}
              value={firstName}
              onChange={event => handleChange('firstname', event)}
              maxLength={50}
            />
            {firstNameErr && (
              <Text style={styles.Errlabel_font_size}>{firstNameErr}</Text>
            )}
          </View>
          <View style={styles.formmain}>
            <Text style={[styles.label, styles.blacktext]}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Last Name"
              placeholderTextColor="#ccc"
              value={lastName}
              onChange={event => {
                handleChange('lastname', event);
              }}
              maxLength={50}
            />
            {lastNameErr && (
              <Text style={styles.Errlabel_font_size}>{lastNameErr}</Text>
            )}
          </View>
          <View style={styles.formmain}>
            <Text style={[styles.label, styles.blacktext]}>
              Mobile Number <Text style={styles.required}>*</Text>{' '}
              <Text style={styles.infoTextSpace}>
                &#40;Numbers only. No dash (-) or dot(.) between numbers&#41;
              </Text>
            </Text>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <TextInput
                style={[
                  styles.Countryinput,
                  styles.blacktext,
                ]}
                placeholder="+1"
                placeholderTextColor="#000"
                editable={false}
                value={country_code}
              />
              <TextInput
                style={[styles.input, styles.blacktext]}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#ccc"
                value={mobile}
                editable={false}
              />
            </View>
            <TouchableOpacity
              style={styles.eyeiconMoblie}
              onPress={() =>
                navigation.navigate('MobileVerification', {
                  state: {mobile_number: mobile},
                })
              }>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.label, styles.blacktext]}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.blacktext]}
              placeholder="Enter Email Address"
              placeholderTextColor="#ccc"
              value={email}
              editable={false}
              // onChange={(e)=>{handleChange("email",e)}}
            />
            <TouchableOpacity
              style={styles.eyeicon}
              onPress={() =>
                navigation.navigate('EmailVerification', {
                  state: {email_address: email},
                })
              }>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color="#E66100"></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.submitbtn} onPress={handleSave}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space20}></View>
          {/* <View style={styles.noaccountmain}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.signuptext}>Reset Password</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View> */}
          <View style={styles.noaccountmainSeparator}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.signuptext}>Reset Password</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>

          <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={[styles.closebtn, styles.helpBtn]}
              onPress={openSupportPage}>
              <Text style={[styles.closebtntext, styles.orgtext]}>
                User Manual
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
            <TouchableOpacity
              style={[styles.closebtn, styles.helpBtn]}
              onPress={openEmailSupport}>
              <Text style={[styles.closebtntext, styles.orgtext]}>
                Email Support
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space10}></View>

          {!appleAuth ? (
            <View style={[styles.checkbtnmain, styles.deatilsbtninner]}>
              <TouchableOpacity
                style={[styles.closebtn, styles.orgoutline]}
                onPress={() => handleLogOut()}>
                <Text style={[styles.closebtntext, styles.orgtext]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              style={styles.dltAccbtn}
              onPress={handleDeleteAcc}>
              <Text style={styles.submitbtntext}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default MyProfile;
