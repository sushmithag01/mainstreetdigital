import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Explore from "../pages/Explore"
import Dashboard from "../pages/Dashboard"
import Account from "../pages/Account"
import Notifications from "../pages/Notifications"
import Messages from "../pages/Messages"
import SignIn from "../pages/SignIn"
import VoucherDetail from "../pages/VoucherDetail";
import CouponDetail from "../pages/CouponDetail";
import { Text, View, TouchableOpacity } from 'react-native';
import styles from "../Common.css"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Redeem from "../pages/Redeem";
import RedeemVerification from "../pages/RedeemVerification";
import MyProfile from "../pages/MyProfile";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";
import MobileVerification from "../pages/MobileVerification";
import ContactSeller from "../pages/ContactSeller";
import Checkout from "../pages/Checkout";
import { Icon, withBadge } from '@rneui/themed';
import ChatPage from "../pages/ChatPage";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import Otp from "../pages/Otp";
import CreateNewPassword from "../pages/CreateNewPassword";
import TabNavigator from "./TabNavigator";
import PaymentSucess from "../pages/PaymentSucess";
import PaymentFailure from "../pages/PaymentFailure";
import DeleteConfirmation from "../pages/DeleteConfirmation";
import RedeemSuccess from "../pages/RedeemSuccess";
import MarketPlaceLists from "../pages/MarketPlaceLists";
import WelcomeScreen from "../pages/WelcomeScreen";
import ExploreDeals from "../pages/ExploreDeals";


let AuthToken;
async function checkUserAuthToken() {
  AuthToken = await AsyncStorage.getItem("token");
}

const BadgedIcon = withBadge(15)(Icon);
const Stack = createNativeStackNavigator();
const PublicStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="Home" component={TabNavigator}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: true }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: true }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingleblack}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('ForgotPassword')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                {/* <Text style={styles.backbtntext}>Back</Text> */}
              </TouchableOpacity>
            </View>
          ),
        }}>
      </Stack.Screen>
      <Stack.Screen
        name="RedeemVerification"
        component={RedeemVerification}
        options={{ headerShown: true }}>
      </Stack.Screen>
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}>
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export { PublicStackNavigator };

const ExploreStackNavigator = ({ navigation }) => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 600,
          backgroundColor: '#f5f5f5',
          padding: 80,
          border: 0
        },
      }}>
      <Stack.Screen
        name="Explore"
        component={Explore}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhome}>
      //       <View>
      //         <Image source={require('../assets/Logo-new-1.png')} style={{ width: 70, height: 61 }}></Image>
      //       </View>
      //       <View style={styles.headerright}>
      //         <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notify}>
      //           <Icon type="ionicon" name="notifications" color="#A9CF4B" />
      //           {/* <BadgedIcon type="ionicon" name="notifications" color="#A9CF4B" /> */}
      //         </TouchableOpacity>
      //         <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
      //           <Image source={profileImg?{uri:profileImg}:defaultImg} style={styles.profile}></Image>
      //         </TouchableOpacity>
      //       </View>
      //     </View>
      //   ),
      // }}
      //  options={{
      //     headerLeft: () => (
      //         <Image source={require("../assets/logo.png")} style={{marginBottom:20}}></Image>
      //       ),
      //     headerRight: () => (
      //     <>
      //       <TouchableOpacity onPress={()=>navigation.navigate('Notifications')}>
      //         <Image  source={require("../assets/user.png")}></Image>
      //       </TouchableOpacity>
      //       <TouchableOpacity onPress={()=>navigation.navigate('MyProfile')}>
      //         <Image  source={require("../assets/user.png")}></Image>
      //       </TouchableOpacity>
      //         </>
      //     ),
      //  }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="VoucherDetail"
        component={VoucherDetail}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhomesingle}>
      //       <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
      //         <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
      //         <Text style={styles.backbtntext}>Voucher Detail</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ),
      // }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="CouponDetail"
        component={CouponDetail}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhomesingle}>
      //       <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
      //         <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
      //         <Text style={styles.backbtntext}>Coupon Detail</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ),
      // }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>My Profile</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="DeleteConfirmation"
        component={DeleteConfirmation}
        options={{
          headerShown: false,
          // header: (props) =>
          // (
          //   <View style={styles.headerhomesingle}>
          //     <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
          //       <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
          //       <Text style={styles.backbtntext}>Payment Success</Text>
          //     </TouchableOpacity>
          //   </View>
          // ),
        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('MyProfile')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerification}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('MyProfile')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Email Verification</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="MobileVerification"
        component={MobileVerification}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('MyProfile')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Back</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Notifications</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="ContactSeller"
        component={ContactSeller}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.goBack()}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Contact Seller</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Checkout"
        component={Checkout}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhomesingle}>
      //       <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate("VoucherDetails")}>
      //         <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
      //         <Text style={styles.backbtntext}>Checkout</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ),
      // }}
      ></Stack.Screen>
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSucess}
        options={{
          headerShown: false,
          // header: (props) =>
          // (
          //   <View style={styles.headerhomesingle}>
          //     <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
          //       <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
          //       <Text style={styles.backbtntext}>Payment Success</Text>
          //     </TouchableOpacity>
          //   </View>
          // ),
        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="PaymentFailure"
        component={PaymentFailure}
        options={{
          headerShown: false,
          // header: (props) =>
          // (
          //   <View style={styles.headerhomesingle}>
          //     <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
          //       <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
          //       <Text style={styles.backbtntext}>Payment Success</Text>
          //     </TouchableOpacity>
          //   </View>
          // ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="RedeemSuccess"
        component={RedeemSuccess}
        options={{
          headerShown: false,

        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>My Account</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="MarketPlaceLists"
        component={MarketPlaceLists}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Explore</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      >
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export { ExploreStackNavigator };
const DashboardStackNavigator = ({ navigation }) => {
  // const [authToken, setAuthtoken] = useState('');
  // useEffect(() => {
  //   checkUserAuthToken().then(() => {
  //     setAuthtoken(AuthToken);
  //   })
  // }, []);
  // if (authToken) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Dashboard</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
  // }
};
export { DashboardStackNavigator };
const AccountStackNavigator = ({ navigation }) => {
  // const [authToken, setAuthtoken] = useState('');
  // useEffect(() => {
  //   checkUserAuthToken().then(() => {
  //     setAuthtoken(AuthToken);
  //   })
  // }, []);
  // if (authToken) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>My Account</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="Redeem"
        component={Redeem}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.goBack()}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Redeem</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="RedeemVerification"
        component={RedeemVerification}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhomesingle}>
      //       <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.goBack()}>
      //         <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
      //         <Text style={styles.backbtntext}>Redeem Verification</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ),
      // }}
      ></Stack.Screen>
      <Stack.Screen
        name="RedeemSuccess"
        component={RedeemSuccess}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="VoucherDetail"
        component={VoucherDetail}
      >
      </Stack.Screen>
      <Stack.Screen
        name="CouponDetail"
        component={CouponDetail}
      >
      </Stack.Screen>
    </Stack.Navigator>
  );
  // }
};
export { AccountStackNavigator };
const NotificationsStackNavigator = ({ navigation }) => {
  const [authToken, setAuthtoken] = useState('');
  useEffect(() => {
    checkUserAuthToken().then(() => {
      setAuthtoken(AuthToken);
    })
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={Notifications}>
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export { NotificationsStackNavigator };
const MessagesStackNavigator = ({ navigation }) => {
  const [authToken, setAuthtoken] = useState('');
  useEffect(() => {
    checkUserAuthToken().then(() => {
      setAuthtoken(AuthToken);
    })
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          header: (props) =>
          (
            <View style={styles.headerhomesingle}>
              <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.navigate('Explore')}>
                <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
                <Text style={styles.backbtntext}>Chat Messages</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="ChatPage"
        component={ChatPage}
      // options={{
      //   header: (props) =>
      //   (
      //     <View style={styles.headerhomesingle}>
      //       <TouchableOpacity style={styles.backbtnmain} onPress={() => navigation.goBack()}>
      //         <Ionicons color="#E66100" name="chevron-back" style={styles.backicon} size={23} />
      //         <Text style={styles.backbtntext}>Message</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ),
      // }}
      >
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export { MessagesStackNavigator };
