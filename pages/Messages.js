import React, {useState, useEffect} from 'react';
import {ButtonGroup} from '@rneui/themed';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListOfMessageApi} from '../Utils/Api/ListOfMessageApi';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Utils/Loader';
import {REACT_APP_BASE_URL} from '../Utils/Constants';
import {SessionTimeOut} from '../Utils/ErrorMessage';

let user_id;
async function getUserid() {
  user_id = await AsyncStorage.getItem('userId');
}
const Messages = ({route}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userId, setuserId] = useState('');
  const [MessageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getUserid().then(() => {
        setuserId(user_id);
        MessagesInfoHandler();
        setLoading(false);
      });
    }
  }, [userId, user_id, isFocused]);

  const MessagesInfoHandler = async () => {
    const data = {
      eu_id: await AsyncStorage.getItem('userId'),
      api_method: 'get',
    };
    const messagedata = await ListOfMessageApi(data);
    if (messagedata.status === 200) {
      setMessageData(messagedata.data);
    } else {
      if (
        messagedata.message === 'Token is invalid!' ||
        messagedata.message === 'Request failed with status code 403'
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

  const ClickHandler = data => {
    // console.log(data.item,"data.item")
    const data_list = {
      channel_id: data.item.channel_id,
      product_id: data.item.product_id,
      bu_id: data.item.business_id,
      product_name: data.item.product_name,
      business_name: data.item.business_name,
      product_type: data.item.product_type,
      product_image: data.item.product_image,
    };
    navigation.navigate('ChatPage', {state: data_list});
  };

  const renderItem = item => {
    if (item.item.chat_type == 1 && selectedIndex == 0) {
      return (
        <TouchableOpacity onPress={() => ClickHandler(item)}>
          <View style={[styles.dashdata2, styles.chatinner]}>
            {item && item.item.product_image ? (
              <Image
                source={{
                  uri: REACT_APP_BASE_URL + '/' + item.item.product_image,
                }}
                style={styles.dashdata3}
              />
            ) : (
              <Image
                source={require('../assets/d4.png')}
                style={styles.dashdata3}></Image>
            )}

            <View style={styles.dashdata4}>
              <Text style={styles.dashdata5}>{item.item.product_name}</Text>
              <Text style={styles.dashdata6}>{item.item.business_name}</Text>
            </View>
            {/* <View>
              <Text style={styles.dashdata8}>12.10 pm</Text>
              <Badge value="0" status="success" badgeStyle={styles.dashdata9} />
            </View> */}
          </View>
        </TouchableOpacity>
      );
    } else if (item.item.chat_type == 2 && selectedIndex == 1) {
      return (
        <TouchableOpacity onPress={() => ClickHandler(item)}>
          <View style={[styles.dashdata2, styles.chatinner]}>
            {item && item.item.product_image ? (
              <Image
                source={{
                  uri: REACT_APP_BASE_URL + '/' + item.item.product_image,
                }}
                style={styles.dashdata3}
              />
            ) : (
              <Image
                source={require('../assets/d4.png')}
                style={styles.dashdata3}></Image>
            )}

            <View style={styles.dashdata4}>
              <Text style={styles.dashdata5}>{item.item.product_name}</Text>
              <Text style={styles.dashdata6}>{item.item.business_name}</Text>
            </View>
            {/* <View>
            <Text style={styles.dashdata8}>12.10 pm</Text>
            <Badge value="0" status="success" badgeStyle={styles.dashdata9} />
          </View> */}
          </View>
        </TouchableOpacity>
      );
    } else {
      <Text>Something Went Wrong..!!!</Text>;
    }
  };
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView>
        <ButtonGroup
          buttons={['Order Related', 'General']}
          selectedIndex={selectedIndex}
          onPress={value => {
            setSelectedIndex(value);
          }}
          containerStyle={styles.btncontainer}
          selectedButtonStyle={styles.selectedbtn}
          buttonContainerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.textStyle}
        />
        <View style={[styles.dashdata1, styles.chatmain]}>
          {MessageData && MessageData.length > 0 ? (
            <SafeAreaView>
              <ScrollView>
                <FlatList
                  data={MessageData}
                  renderItem={renderItem}
                  keyExtractor={item => item.comm_id}
                />
              </ScrollView>
            </SafeAreaView>
          ) : (
            <Text
              style={{textAlign: 'center', marginTop: 200, fontWeight: '800'}}>
              No Chat Available..!!
            </Text>
          )}

          {/* <View style={[styles.dashdata2, styles.chatinner]}>
            <Image source={require('../assets/d4.png')} style={styles.dashdata3}></Image>
            <View style={styles.dashdata4}>
              <Text style={styles.dashdata5}>Up to 15% OFF on Lipsticks</Text>
              <Text style={styles.dashdata6}>Bijou Lash Extensions</Text>
            </View>
            <View>
              <Text style={styles.dashdata8}>12.10 pm</Text>
              <Badge value="0" status="success" badgeStyle={styles.dashdata9} />
            </View>
          </View>
          <View style={[styles.dashdata2, styles.chatinner]}>
            <Image source={require('../assets/d4.png')} style={styles.dashdata3}></Image>
            <View style={styles.dashdata4}>
              <Text style={styles.dashdata5}>Up to 15% OFF on Lipsticks</Text>
              <Text style={styles.dashdata6}>Bijou Lash Extensions</Text>
            </View>
            <View>
              <Text style={styles.dashdata8}>12.10 pm</Text>
              <Badge value="0" status="success" badgeStyle={styles.dashdata9} />
            </View>
          </View> */}
        </View>
      </ScrollView>
    </>
  );
};

export default Messages;
