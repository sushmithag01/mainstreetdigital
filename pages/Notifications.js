import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView, SafeAreaView, FlatList} from 'react-native';
import styles from '../Common.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotificationApi} from '../Utils/Api/NotificationApi';
import Toast from 'react-native-root-toast';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import Moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();
  const [notificationdata, setNotificationData] = useState([]);
  useEffect(() => {
    NotificationsApiHandler();
  }, []);
  const NotificationsApiHandler = async () => {
    const data = {
      user_id: await AsyncStorage.getItem('userId'),
      user_type: 'end_user',
    };
    console.log('data', data);
    const NotificationList = await NotificationApi(data);
    if (NotificationList.status == 200) {
      setNotificationData(NotificationList.data);
    } else {
      if (NotificationList.status == 429) {
        navigation.navigate('Explore');
        Toast.show(NotificationList.message, {
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
        NotificationList.message === 'Token is invalid!' ||
        NotificationList.message === 'Request failed with status code 403'
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
      }
    }
  };
  const renderItem = item => {
    return (
      <>
        <Text style={styles.date}>
          {Moment(item.item.created_at).format('DD.MMM.YYYY')}
        </Text>
        <View style={styles.notimain}>
          <Text style={styles.noti1}>{item.item.heading}</Text>
          <Text style={styles.noti2}>{item.item.content}</Text>
        </View>
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.mainbg}>
            {notificationdata && notificationdata.length > 0 ? (
              <FlatList
                data={notificationdata}
                keyExtractor={item => item.notify_id}
                renderItem={renderItem}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '800',
                  marginTop: 300,
                }}>
                No Data Available..!!
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Notifications;
