import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import styles from '../Common.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {InsertChatApi} from '../Utils/Api/InsertChatApi';
import {SessionTimeOut} from '../Utils/ErrorMessage';

const local_data = [
  {
    value: '1',
    lable: 'Country 1',
  },
  {
    value: '2',
    lable: 'Country 2',
  },
  {
    value: '3',
    lable: 'Country 3',
  },
  {
    value: '4',
    lable: 'Country 4',
  },
  {
    value: '5',
    lable: 'Country 5',
  },
];
let user_id;
async function getuserd() {
  user_id = await AsyncStorage.getItem('userId');
}
const ContactSeller = ({route}) => {
  const navigation = useNavigation();
  const [country, setCountry] = useState('1');
  const [RouteParams, setRouteParams] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [useId, setUserId] = useState('');
  useEffect(() => {
    getuserd().then(() => {
      setUserId(user_id);
      setRouteParams(route.params.state);
    });
  }, []);
  let CommunityId =
    'msd_' + useId + '_' + RouteParams.flag + '_' + RouteParams.business_id;
  let route_params_data = {
    channel_id: CommunityId,
    product_name: RouteParams.product_name,
    business_name: RouteParams.business_name,
  };
  const HandleApi = async Messagedata => {
    const MessageData = await InsertChatApi(Messagedata);
    if (MessageData.status == 200) {
      navigation.navigate('Messagess', {
        screen: 'ChatPage',
        params: {
          state: route_params_data,
        },
      });
      // navigation.navigate('Messagess');
    } else {
      if (
        MessageData.message === 'Token is invalid!' ||
        MessageData.message === 'Request failed with status code 403'
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
  const HandleSave = event => {
    event.preventDefault();
    if (textMessage && RouteParams.flag == 'voucher') {
      const Messagedata = {
        user_id: useId,
        bu_id: RouteParams.business_id,
        channel_id: CommunityId,
        product_id: RouteParams.id,
        product_type: 1,
        help_reason: textMessage,
      };
      HandleApi(Messagedata);
    } else if (textMessage && RouteParams.flag == 'coupon') {
      const Messagedata = {
        user_id: useId,
        bu_id: RouteParams.business_id,
        channel_id: CommunityId,
        product_id: RouteParams.id,
        product_type: 2,
        help_reason: textMessage,
      };
      HandleApi(Messagedata);
    }
  };
  return (
    <>
      <SafeAreaView>
        <ScrollView style={styles.mainform}>
          {/* <View>
        <Text style={styles.orangetitletext}>Contact Seller</Text>
      </View> */}
          <View style={styles.space20}></View>
          <View>
            <Text style={styles.sellertext}>
              Contact Seller :
              <Text style={styles.sellertextbold}>
                {RouteParams ? RouteParams.product_name : null}{' '}
              </Text>
            </Text>
            <Text style={styles.sellertext}>
              Voucher :
              <Text style={styles.sellertextbold}>
                {RouteParams ? RouteParams.business_name : null}{' '}
              </Text>
            </Text>
          </View>
          <View style={styles.space20}></View>
          {/* <View>
            <Text style={[styles.label, styles.blacktext]}>Need Help With <Text style={styles.required}></Text></Text>
            <SelectCountry
              style={styles.dropdown1}
              selectedTextStyle={styles.selectedTextStyle1}
              placeholderStyle={styles.placeholderStyle1}
              maxHeight={200}
              value={country}
              data={local_data}
              valueField="value"
              labelField="lable"
              placeholder="Select country"
              searchPlaceholder="Search..."
              onChange={e => {
                setCountry(e.value);
              }}
            />
          </View> */}
          <View>
            <Text style={[styles.label, styles.blacktext]}>Your Message</Text>
            <TextInput
              style={[styles.input, styles.blacktext, styles.textarea]}
              placeholder="Your Message"
              placeholderTextColor="#ccc"
              multiline={true}
              numberOfLines={4}
              onChange={event => setTextMessage(event.nativeEvent.text)}
              value={textMessage}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.submitbtn} onPress={HandleSave}>
              <Text style={styles.submitbtntext}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space20}></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default ContactSeller;
