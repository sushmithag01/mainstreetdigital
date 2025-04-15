import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Platform, TouchableOpacity, Image,Keyboard} from 'react-native';
import styles from '../Common.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
  Actions,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {InsertChatApi} from '../Utils/Api/InsertChatApi';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../Utils/Loader';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import {REACT_APP_BASE_URL} from '../Utils/Constants';

let auth_user_id;
let auth_user_name;
async function getuserid() {
  auth_user_id = await AsyncStorage.getItem('userId');
  auth_user_name = await AsyncStorage.getItem('username');
}
const ChatPage = ({route, navigation}) => {
  let header = navigation;
  const isFocused = useIsFocused();
  let route_params = route.params.state;
  const [allmessages, setAllMessages] = useState([]);
  const [routeParams, setRouteParams] = useState([]);
  const [chatSize, setChatSize] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatuser, setChatUser] = useState('');
  const [authUserId, setAuthUserId] = useState('');
  const [authUserName, setAuthUserName] = useState('');
  const [channel_id, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
    if (isFocused) {
      setLoading(true);
      setTimeout(() => {
        setRouteParams(route_params);
        setChannelId(route_params.channel_id);
        navigation.setOptions({
          header: props => (
            <>
              <View style={styles.headerhomesingle23}>
                <TouchableOpacity
                  style={[styles.backbtnmain, styles.backinnert]}
                  onPress={() => navigation.navigate('Messages')}>
                  <Ionicons
                    color="#E66100"
                    name="chevron-back"
                    style={{padding: 0}}
                    size={28}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.headerhomesingle11]}>
                <View>
                  {route.params.state && route.params.state?.product_image ? (
                    <Image
                      source={{
                        uri:
                          REACT_APP_BASE_URL +
                          '/' +
                          route.params.state?.product_image,
                      }}
                      style={styles.dashdata34}
                    />
                  ) : (
                    <Image
                      source={require('../assets/d4.png')}
                      style={styles.dashdata3}></Image>
                  )}
                </View>
                <View style={styles.chatHeader}>
                  <Text style={styles.backbtntext} numberOfLines={1}>
                    {route.params.state?.product_name}
                  </Text>
                  <Text style={styles.secext1} numberOfLines={1}>
                    {' '}
                    {route.params.state?.business_name}
                  </Text>
                </View>
              </View>
            </>
          ),
        });
        getuserid().then(() => {
          getuserid().then(() => {
            const _id = auth_user_id;
            const name = auth_user_name;
            setAuthUserId(_id);
            setAuthUserName(name);
            let ChatUser = {_id, name};
            setChatUser(ChatUser);
          });
        });
        setLoading(false);
      }, 500);
    }
  }, [route, route_params, isFocused, routeParams]);

  useEffect(() => {
    let unsubscribe;
    const handleFirebase = async () => {
      if (channel_id) {
        console.log('channel_id', channel_id);
        try {
          unsubscribe = firestore()
            .collection(channel_id)
            .onSnapshot(querySnapshot => {
              if (!querySnapshot || querySnapshot.empty) {
                console.warn('No messages found or querySnapshot is null');
                return;
              } else {
                const messagesFirestore = querySnapshot
                  .docChanges()
                  .filter(({type}) => type === 'added')
                  .map(({doc}) => {
                    // if (!doc.data().read) {
                    //     updateFirebaseDB(doc.id);
                    // }
                    let list_msg = {
                      _id: doc.data()._id,
                      text: doc.data().text,
                      createdAt: new Date(doc.data().createdAt.toDate()),
                      sent: doc.data().sent,
                      read: doc.data().read,
                      received: doc.data().received,
                      image: doc.data().image,
                      user: {
                        _id: doc.data().user._id,
                        name: doc.data().user.name,
                      },
                    };
                    // console.log("firelist_msg",list_msg);
                    return list_msg;
                  })
                  .sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                  );
                appendMessages(messagesFirestore);
              }
            });
          return unsubscribe;
        } catch (error) {
          console.log('error', error);
        }
      }
    };

    // Call handleFirebase when the component mounts or channel_id changes
    handleFirebase();

    // Return the unsubscribe function to clean up the listener
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup listener on unmount
      }
    };
  }, [channel_id, isFocused]); // Ensure dependencies are set correctly

  // insert chat to Api
  const handleChatApi = async data => {
    if (routeParams.flag === 'voucher') {
      const payload = {
        api_method: 'post',
        eu_id: authUserId,
        bu_id: routeParams.bu_id,
        channel_id: routeParams.channel_id,
        product_id: routeParams.product_id,
        product_type: 1,
        help_reason: data,
      };
      const MessageData = await InsertChatApi(payload);
    } else if (routeParams.flag === 'coupon') {
      const Messagedata = {
        api_method: 'post',
        eu_id: authUserId,
        bu_id: routeParams.bu_id,
        channel_id: routeParams.channel_id,
        product_id: routeParams.product_id,
        product_type: 2,
        help_reason: data,
      };
      const MessageData = await InsertChatApi(Messagedata);
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
    } else if (routeParams.product_type) {
      const Messagedata = {
        api_method: 'post',
        eu_id: authUserId,
        bu_id: routeParams.bu_id,
        channel_id: routeParams.channel_id,
        product_id: routeParams.product_id,
        product_type: parseInt(routeParams.product_type),
        help_reason: data,
      };
      const MessageData = await InsertChatApi(Messagedata);
    }
  };
  //
  const updateFirebaseDB = async () => {
    if (channel_id) {
      const usersCollection = firestore()
        .collection(channel_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (
              channel_id &&
              doc.data().read == false &&
              doc.data().user._id !== auth_pet_id
            ) {
              console.log(doc.id); // For doc name
              const getunresdMsg = firestore()
                .collection(channel_id)
                .doc(doc.id)
                .update({
                  read: true,
                })
                .then(() => {
                  console.log('User updated!');
                });
            } // For data inside doc
          });
        });
    }
  };
  function renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.toolbar}
        placeholder="Type your message here..."
      />
    );
  }
  function renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: -50,
            marginBottom: 0,
            width: 80,
            marginLeft: 30,
          }}>
          <Icons name="send-circle" size={38} color="#a8cf76" />
        </View>
      </Send>
    );
  }

  // console.log('messages', messages);
  async function handleSend(messages) {
    Keyboard.dismiss();
    firestore()
      .collection(routeParams.channel_id)
      .add({
        _id: messages[0]._id,
        createdAt: messages[0].createdAt,
        text: messages[0].text,
        user: {
          _id: messages[0].user._id,
          name: messages[0].user.name,
        },
        sent: true,
        received: routeParams.product_id,
      })
      .then(() => {
        handleChatApi(messages[0].text);
        console.log('User added!');
      });
  }
  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#E66100',
            marginBottom: 15,
          },
          left: {
            backgroundColor: '#fff',
            marginBottom: 12,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
            paddingBottom: 2,
          },
          left: {
            color: '#000',
            paddingBottom: 2,
          },
        }}
      />
    );
  }
  const appendMessages = useCallback(
    messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [messages],
  );
  const renderTick = props => {
    return (
      <Text style={{color: '#fff', marginRight: 5}}>
        {props.sent ? '✓✓' : ''}
      </Text>
    );
  };

  const renderActions = props => {
    const options = {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.5,
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'pageSheet',
      cameraType: 'front',
    };
    return (
      <Actions
        containerStyle={{
          position: 'absolute',
          right: 60,
          bottom: '10%',
          zIndex: 999999,
        }}
        {...props}
        icon={() => (
          <Text style={styles.attach}>
            <IconsMaterialIcons
              name="attach-file"
              size={25}
              color="#AC5F5A"
              style={styles.icon}
            />
          </Text>
        )}
        options={{
          Image: async props => {
            // You can also use as a promise without 'callback':
            const result = await launchImageLibrary(options);
            const imgbase64 = result.assets[0].base64;
            var imgURI = result.assets[0].uri;
            console.log('imgURI', imgURI);
            var filename = imgURI.substring(imgURI.lastIndexOf('/') + 1);
            console.log('filename', imgURI);
            try {
              const file = await storage().ref(filename).putFile(imgURI);
              console.log('file', file);
              const url = await storage().ref(filename).getDownloadURL();
              var image_data = [
                {
                  image: url,
                  _id: uuid.v4(),
                  user: senderInfo,
                  createdAt: new Date(),
                  text: '',
                  sent: true,
                  read: false,
                  received: recieverInfo.pet_id,
                  name: recieverInfo.pet_name,
                  receiver_profile_image: recieverInfo.pet_image_path,
                  receiver_friend_list_id: recieverInfo.friend_list_id,
                },
              ];
              // messages.push(image_data);
              const writes = image_data.map(m =>
                firestore().collection(channel_id).add(m),
              );
              await Promise.all(writes);
              console.log(url);
            } catch (e) {
              console.log('error', e);
            }
          },
          Cancel: props => {
            console.log('Cancel');
          },
        }}
        onSend={args => console.log(args)}
      />
    );
  };

  function renderLoading() {
    return (
      <View style={styles.loadingcontainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={{opacity: 1}}
          color="#999999"
        />
      </View>
    );
  }
  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      {/* <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        keyboardShouldPersistTaps={true}> */}
        <GiftedChat
          renderUsernameOnMessage={true}
          messages={messages}
          user={chatuser}
          onSend={handleSend}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderBubble={renderBubble}
          scrollToBottom={true}
          alwaysShowSend={true}
          renderTicks={renderTick}
          {...(Platform.OS !== 'android'
            ? {
                bottomOffset: 0,
              }
            : {bottomOffset: 0,})}
        />
      {/* </KeyboardAwareScrollView> */}
    </>
  );
};
export default ChatPage;
