import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExploreStackNavigator, DashboardStackNavigator, AccountStackNavigator, MessagesStackNavigator } from './StackNavigator';
import { Text, View, Image } from 'react-native';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="AllPages"
      activeColor="#eee"
      labelStyle={{ fontSize: 12 }}
      screenOptions={{
        activeTintColor: '#eee',
        tabBarStyle: {
          backgroundColor: '#A9CF4B',
          borderTopColor: 'transparent',
          paddingTop: 10,
          borderRadius: 50,
          marginBottom: 5,
          paddingBottom: 0,
          height: 54,
          boxShadow: 'none',
          elevation: 0
        },
        style: {
          boxShadow: 'none',
          elevation: 0
        }
      }}
    >
      <Tab.Screen
        name="Exploree"
        component={ExploreStackNavigator}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            //Any custom code here
            navigation.navigate("Exploree", { screen: 'Explore' });
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <Image style={{ display: !focused ? "flex" : "none", width: 20 }} source={require("../assets/Home.png")}></Image>
              <View style={{ flex: 2, flexDirection: "row", marginTop: 3, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 5, display: focused ? "flex" : "none" }}>
                <Image style={{ width: 20 }} source={require("../assets/Home-Fill.png")}></Image>
                <Text style={{ paddingTop: 3, color: "#A9CF4B", fontFamily: 'Montserrat-Bold', fontSize: 13 }}> Home</Text>
              </View>
            </>
          ),
        }} />
      <Tab.Screen
        name="Dashboardd"
        component={DashboardStackNavigator}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            //Any custom code here
            navigation.navigate("Dashboardd", { screen: 'Dashboard' });
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <Image style={{ display: !focused ? "flex" : "none", width: 20 }} source={require("../assets/Dashboard.png")}></Image>
              <View style={{ flex: 2, flexDirection: "row", marginTop: 3, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 5, display: focused ? "flex" : "none" }}>
                <Image style={{ width: 20 }} source={require("../assets/Dashboard-Fill.png")}></Image>
                <Text style={{ paddingTop: 3, color: "#A9CF4B", fontFamily: 'Montserrat-Bold', fontSize: 13 }}> Dashboard</Text>
              </View>
            </>
          ),
        }} />
      <Tab.Screen
        name="Accountt"
        component={AccountStackNavigator}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            //Any custom code here
            navigation.navigate("Accountt", { screen: 'Account', params: { selected_index: 0 } });
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <Image style={{ display: !focused ? "flex" : "none", width: 24 }} source={require("../assets/Account.png")}></Image>
              <View style={{ flex: 2, flexDirection: "row", marginTop: 3, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 5, display: focused ? "flex" : "none" }}>
                <Image style={{ width: 24 }} source={require("../assets/Account-Fill.png")}></Image>
                <Text style={{ paddingTop: 3, color: "#A9CF4B", fontFamily: 'Montserrat-Bold', fontSize: 13 }}> Account</Text>
              </View>
            </>
          ),
        }} />
      <Tab.Screen
        name="Messagess"
        component={MessagesStackNavigator}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            //Any custom code here
            navigation.navigate("Messagess", { screen: 'Messages' });
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <Image style={{ display: !focused ? "flex" : "none", width: 24 }} source={require("../assets/Messages.png")}></Image>
              <View style={{ flex: 2, flexDirection: "row", marginTop: 3, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 5, display: focused ? "flex" : "none" }}>
                <Image style={{ width: 24 }} source={require("../assets/Message-Fill.png")}></Image>
                <Text style={{ paddingTop: 3, color: "#A9CF4B", fontFamily: 'Montserrat-Bold', fontSize: 13 }}> Chat</Text>
              </View>
            </>
          ),
        }} />
    </Tab.Navigator>
  )
}
export default BottomTabNavigator;