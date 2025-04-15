import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import Otp from '../pages/Otp';
import CreateNewPassword from '../pages/CreateNewPassword';
import TabNavigator from "./TabNavigator";
import RedeemVerification from "../pages/RedeemVerification";
import OopsPage from '../pages/OopsPage';

const Stack = createNativeStackNavigator();

const PublicNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: false }}
      >
      </Stack.Screen>
      <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        options={{ headerShown: false }}>
      </Stack.Screen>
      <Stack.Screen
        name="RedeemVerification"
        component={RedeemVerification}
        options={{ headerShown: true }}>
      </Stack.Screen>
      <Stack.Screen
        name="OopsPage"
        component={OopsPage}
        options={{ headerShown: true }}>
      </Stack.Screen>
    </Stack.Navigator>
  )
}
export default PublicNavigator;