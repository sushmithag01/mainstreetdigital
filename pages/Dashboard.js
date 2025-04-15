import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import styles from '../Common.css';
import {DashboardApi} from '../Utils/Api/DashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Utils/Loader';
import {Snackbar} from 'react-native-paper';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {SessionTimeOut} from '../Utils/ErrorMessage';

import Moment from 'moment';
let user_id;
let city_id;
async function getUserId() {
  user_id = await AsyncStorage.getItem('userId');
  city_id = await AsyncStorage.getItem('city_id');
}
const Dashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [userId, setuserId] = useState('');
  const [cityId, setcityId] = useState('');
  const [headerData, setHeaderData] = useState([]);
  const [recentActivity, setRecentActivityData] = useState([]);
  const [topSection, setTopSectionData] = useState([]);
  const [toastMsg, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getUserId().then(() => {
        setuserId(user_id);
        DashboardHandler({});
      });
    }
  }, [isFocused]);

  const DashboardHandler = async () => {
    setLoading(true);
    const data = {
      user_id: await AsyncStorage.getItem('userId'),
      city_id: await AsyncStorage.getItem('city_id'),
    };
    const dashboardData = await DashboardApi(data).finally(() => {
      setLoading(false);
    });
    if (dashboardData.status === 200) {
      setHeaderData(dashboardData.headers);
      setTopSectionData(dashboardData.top_section);
      setRecentActivityData(dashboardData.recent_activity);
    } else {
      if (dashboardData.status === 429) {
        setLoading(true);
        Toast.show(dashboardData.message, {
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
      } else if (
        dashboardData.message === 'Token is invalid!' ||
        dashboardData.message === 'Request failed with status code 403'
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
        Toast.show(dashboardData.message, {
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

  const handleItem = data => {
    if (data.flag === 'coupon') {
      navigation.navigate('Accountt', {
        screen: 'Account',
        params: {selected_index: 1},
      });
    } else {
      navigation.navigate('Accountt', {
        screen: 'Account',
        params: {selected_index: 0},
      });
    }
  };

  const renderItem = item => {
    let date = item.item.date;
    let format_date = Moment(date).format('yyyy');
    // console.log("item", item.item)
    return (
      <>
        <Text style={styles.date}>{item ? item.item.date : null}</Text>
        <View style={styles.dashdata1}>
          <View style={styles.dashdata2}>
            {/* <Image source={require('../assets/d4.png')} style={styles.dashdata3}></Image> */}
            <View style={styles.dashdata4}>
              <TouchableOpacity onPress={() => handleItem(item.item)}>
                <Text
                  style={[{textDecorationLine: 'underline'}, styles.dashdata5]}>
                  {item ? item.item.offer : null}
                </Text>
              </TouchableOpacity>

              <Text style={styles.dashdata6}>
                {item ? item.item.merchant_name : null}
              </Text>
            </View>
            <Text style={styles.dashdata7}>
              {item ? item.item.status : null}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : null}
      <SafeAreaView>
        <ScrollView>
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
          <View style={styles.dashmain}>
            <View style={styles.dashinner}>
              <Image
                source={require('../assets/d1.png')}
                style={styles.dash1}></Image>
              <Text style={styles.dash2}>
                {topSection && topSection.available_voucher_count
                  ? topSection.available_voucher_count
                  : '0'}
              </Text>
              <Text style={styles.dash3}>Available {'\n'}Vouchers</Text>
            </View>
            <View style={styles.dashinner}>
              <Image
                source={require('../assets/d2.png')}
                style={styles.dash1}></Image>
              <Text style={styles.dash2}>
                {topSection && topSection.available_coupon_count
                  ? topSection.available_coupon_count
                  : '0'}
              </Text>
              <Text style={styles.dash3}>Available {'\n'}Coupons</Text>
            </View>
            <View style={styles.dashinner}>
              <Image
                source={require('../assets/d3.png')}
                style={styles.dash1}></Image>
              <Text style={styles.dash2}>
                ${' '}
                {topSection && topSection.total_saving
                  ? topSection.total_saving
                  : '0'}
              </Text>
              <Text style={styles.dash3}>Total {'\n'}Savings</Text>
            </View>
          </View>
          <View style={styles.dashmain2}>
            <View style={[styles.titlemain]}>
              <Text style={[styles.title]}>Recent Activity</Text>
            </View>
            <View>
              <SafeAreaView>
                <ScrollView style={{marginBottom: 50, paddingBottom: 0}}>
                  {recentActivity && recentActivity.length > 0 ? (
                    <FlatList
                      data={recentActivity}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                    />
                  ) : (
                    <Text
                      style={{textAlign: 'center', margin: 100, fontSize: 18}}>
                      No Data Available..!!
                    </Text>
                  )}
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Dashboard;
