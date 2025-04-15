import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { Alert, LogBox } from 'react-native';
import { addEventListener } from '@react-native-community/netinfo';

import TabNavigator from './navigation/TabNavigator';
import {
  AccountStackNavigator,
  ExploreStackNavigator,
  PublicStackNavigator,
} from './navigation/StackNavigator';
import OopsPage from './pages/OopsPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Otp from './pages/Otp';
import CreateNewPassword from './pages/CreateNewPassword';
import RedeemVerification from './pages/RedeemVerification';
import VersionCheck from 'react-native-version-check';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import WelcomeScreen from './pages/WelcomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [authToken, setAuthtoken] = useState<string | null>(null);
  const [isInternetConnect, setInternetConnect] = useState(true);
  const [isInternetReachable, setInternetReachable] = useState(true);

  // Splash screen logic
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      SplashScreen.hide(); // Hide the splash screen after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => {
      clearTimeout(splashTimer); // Clear the timeout to prevent memory leaks
    };
  }, []);

  // Internet connection listener
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setInternetConnect(state.isConnected ?? true); // Fallback to true if null
      setInternetReachable(state.isInternetReachable ?? true); // Fallback to true if null
    });

    return () => {
      unsubscribe(); // Unsubscribe when the effect is cleaned up
    };
  }, []);

  // Fetch user auth token
  useEffect(() => {
    const checkUserAuthToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setAuthtoken(token); // Set the token in state
    };

    checkUserAuthToken();
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const currentVersionCode = await VersionCheck.getCurrentBuildNumber(); // Properly await this
      const latestVersionCode = await VersionCheck.getCurrentBuildNumber();
      const latestVersionNumber = await VersionCheck.getLatestVersion();
      const currentVersionNumber = await VersionCheck.getCurrentVersion();
      if (currentVersionCode !== latestVersionCode || currentVersionNumber !== latestVersionNumber) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: async () => {
                try {
                  let appStoreUrl;
                  if (Platform.OS === "ios") {
                    // Get iOS store URL
                    appStoreUrl = await (await VersionCheck.getStoreUrl({ appID: "6447948344" }));
                  } else {
                    // Get Android store URL
                    appStoreUrl = await (await VersionCheck.getStoreUrl({ packageName: "com.shoplocal" }));
                  }

                  // Ensure appStoreUrl is a valid string
                  if (typeof appStoreUrl === 'string') {
                    Linking.openURL(appStoreUrl);
                  } else {
                    console.error("Invalid app store URL, expected a string but got:", appStoreUrl);
                  }
                } catch (error) {
                  console.error("Failed to get store URL:", error);
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error("Failed to check version:", error);
    }
  };


  // Ignore all logs
  LogBox.ignoreAllLogs(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isInternetConnect ? (
            authToken ? (
              <Stack.Group>
                <Stack.Screen
                  name="Home"
                  component={TabNavigator}
                  options={{ headerShown: false }}
                />
                {/* Other authenticated screens */}
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen
                  name="Public"
                  component={PublicStackNavigator}
                  options={{ headerShown: false }}
                />
                {/* Other public screens */}
              </Stack.Group>
            )
          ) : (
            <Stack.Group>
              <Stack.Screen
                name="OopsPage"
                component={OopsPage}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          )}

          <Stack.Group>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Otp"
              component={Otp}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RedeemVerification"
              component={RedeemVerification}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="ExploreStackNavigator"
              component={ExploreStackNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AccountStackNavigator"
              component={AccountStackNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>


        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
