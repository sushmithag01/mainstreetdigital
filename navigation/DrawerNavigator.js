import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import {StyleSheet} from 'react-native';
import Otp from '../pages/Otp';
import CreateNewPassword from '../pages/CreateNewPassword';
import RedeemVerification from '../pages/RedeemVerification';

const Drawer = createDrawerNavigator();
const DrawerNavigator = ({navigation}) => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        drawerStyle: {
          color: '#000',
          backgroundColor: '#fff',
          headerShown: false,
          swipeEdgeWidth: 0,
          drawerLockMode: 'locked-open',
          swipeEnabled: false,
        },
      }}>
      {/* <Drawer.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} /> */}
      {/* <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} /> */}
      <Drawer.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Otp"
        component={Otp}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      {/* <Drawer.Screen name="SignIn" component={SignIn}  options={{ headerShown: false }}/>  */}
      <Drawer.Screen
        name="RedeemVerification"
        component={RedeemVerification}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  profilename: {
    fontSize: 18,
    color: '#ea8120',
  },
  profileemail: {
    color: '#000',
    fontSize: 12,
  },
  headerContent: {
    marginLeft: 50,
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 63,
    marginBottom: 0,
  },
});
export default DrawerNavigator;
