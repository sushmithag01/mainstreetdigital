import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import styles from '../Common.css';
import {CheckBox} from '@rneui/themed';
import PurchasedVoucherInfo from './PurchasedVoucherInfo';
import {PurchaseVoucherApi} from '../Utils/Api/PurchaseVoucherApi';
import {Snackbar} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import {
  StripeProvider,
  useStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import {STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY} from '../Utils/Constants';
import PaymentScreen from './PaymentScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoreStripeResponseApi} from '../Utils/Api/StoreStripeResponseApi';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Checkout = ({props, route}) => {
  const stripe = useStripe();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {confirmPayment} = useConfirmPayment();
  const routeParams = route.params.state.productdetail[0];
  const [check4, setCheck4] = useState(false);
  const [productInfo, setProductInfo] = useState([]);
  const [creditCardinfo, setCreditCardInfo] = useState([]);
  const [creditcardVald, setCreditCardvald] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [toastMsg, setToastMessage] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [cardInfo, setCardDetails] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (isFocused) {
      navigation.setOptions({
        header: props => (
          <>
            <View style={styles.headerhomesingle}>
              <TouchableOpacity
                style={[styles.backbtnmain, styles.backinnert]}
                onPress={() => handleBackBtn()}>
                <Ionicons
                  color="#E66100"
                  name="chevron-back"
                  style={styles.backicon}
                  size={23}
                />
                <Text style={styles.backbtntext} numberOfLines={2}>
                  Checkout Page
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ),
      });
      setProductInfo(routeParams);
      setCardDetails('');
      setLoading(false);
    }
  }, [route, routeParams, isFocused]);

  const handleBackBtn = () => {
    navigation.navigate('VoucherDetail', {
      state: {product: routeParams, pageName: 'checkout'},
    });
  };

  const HandlePayment = async () => {
    if (!isChecked) {
      Alert.alert('Alert',
        'Please select the checkbox to accept the terms and conditions.',
      );
      setLoading(false);
    } else if (
      !cardInfo &&
      (cardInfo.validNumber ||
        cardInfo.validCVC ||
        cardInfo.validExpiryDate === 'Invalid')
    ) {
      Alert.alert('Please enter valid card details..!!');
    } else {
      try {
        const billingDetails = {
          email: await AsyncStorage.getItem('userEmail'),
        };
        if (
          cardInfo.validNumber &&
          cardInfo.validCVC &&
          cardInfo.validExpiryDate === 'Valid'
        ) {
          let payload = {
            cardinfo: cardInfo,
            productinfo: productInfo,
          };
          // console.log("payload", payload);
          const cardresponse = await PurchaseVoucherApi(payload);
          console.log('cardresponse', cardresponse);
          if (cardresponse.status == 200) {
            // after getting client Secret stripe payment
            const {paymentIntent, error} = await confirmPayment(
              cardresponse.client_secret,
              {
                paymentMethodType: 'Card',
                paymentMethodData: {
                  billingDetails,
                },
              },
            );
            if (error) {
              console.log('Payment confirmation error', error);
              handleStripeFailureRes();
            } else if (paymentIntent) {
              console.log(
                'Success from promise',
                paymentIntent.status === 'Succeeded',
              );
              if (paymentIntent.status === 'Succeeded') {
                handleStripeResponse(paymentIntent);
              }
            }
          } else {
            if (cardresponse.status === 429) {
              Toast.show(cardresponse.message, {
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
                  fontWeight: '500', // Increase the font size here
                },
              });
              navigation.navigate('Explore');
            } else if (cardresponse.message === 'Token is invalid!') {
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
                  fontWeight: '500', // Increase the font size here
                },
              });
            } else {
              Toast.show(cardresponse.message, {
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
                  fontWeight: '500', // Increase the font size here
                },
              });
            }
          }
        }
      } catch (err) {
        console.log('err', err);
        Toast.show('please Enter valid card information..!!', {
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
            fontWeight: '500', // Increase the font size here
          },
        });
      }
    }
  };
  // stripe failure response handling
  const handleStripeFailureRes = () => {
    navigation.navigate('ExploreStackNavigator', {
      screen: 'PaymentFailure',
      params: {productInfo: productInfo},
    });
  };

  //  stripe success response to DB
  const handleStripeResponse = async stripedata => {
    let payload = {
      cardinfo: cardInfo,
      productinfo: productInfo,
      stripeResponse: stripedata,
    };
    const responseData = await StoreStripeResponseApi(payload);
    if (responseData.status === 200) {
      Toast.show(responseData.message, {
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
          fontWeight: '500', // Increase the font size here
        },
      });
      navigation.navigate('PaymentSuccess');
    } else {
      navigation.navigate('Explore');
      if (responseData.status === 429) {
        Toast.show(responseData.message, {
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
            fontWeight: '500', // Increase the font size here
          },
        });
      } else if (
        responseData.message === 'Token is invalid!' ||
        responseData.message === 'Request failed with status code 403'
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
            fontWeight: '500', // Increase the font size here
          },
        });
      } else {
        Toast.show(responseData.message, {
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
            fontWeight: '500', // Increase the font size here
          },
        });
      }
    }
  };

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
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
          <View style={styles.checkoutmain}>
            <Text style={styles.checktext1}>Checkout (1 Item)</Text>
            <Text style={styles.checktext2}>
              Please fill out the billing information
            </Text>
            <View>
              <Text style={styles.orangetitlebold}>Your Item</Text>
              <PurchasedVoucherInfo productinfo={productInfo} />
            </View>
            <View>
              <CheckBox
                checked={isChecked}
                onPress={() => setChecked(!isChecked)}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon={'checkbox-blank-outline'}
                title={
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Montserrat-Medium',
                        color: '#000',
                      }}>
                      {' '}
                      I accept the
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: '#E66100',
                          fontSize: 15,
                          fontFamily: 'Montserrat-Medium',
                          // textDecorationLine: 'underline',
                        }}>
                        {' '}
                        Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
                containerStyle={styles.checkOutBox}
                checkedColor="#E66100"
                wrapperStyle={styles.wrapstyle}
              />
            </View>
            <View>
              <Text
                style={{
                  color: '#E66100',
                  fontSize: 18,
                  fontFamily: 'Montserrat-Medium',
                  marginBottom: 10,
                  color: '#000',
                  // textDecorationLine: 'underline',
                }}>
                {' '}
                Terms & Conditions
              </Text>
            </View>
            {productInfo && productInfo.voucher_term_condition ? (
              <View>
                <FlatList
                  data={productInfo.voucher_term_condition}
                  renderItem={({item}) => {
                    return (
                      <View style={{marginBottom: 10}}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            marginLeft: 20,
                            fontFamily: 'Montserrat-Medium',
                            color: '#000',
                          }}>{`\u2022 ${item}`}</Text>
                      </View>
                    );
                  }}
                />
                {/* <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 20 }}>{productInfo.voucher_term_condition}</Text> */}
              </View>
            ) : (
              ''
            )}

            <View>
              <Text style={styles.orangetitlebold}>Payment method</Text>
              <View>
                {/* <CreditCardInput onChange={handleCreditcard} /> */}
              </View>

              <View style={styles.paynowmain}>
                <StripeProvider
                  publishableKey={STRIPE_PUBLIC_KEY}
                  merchantIdentifier={STRIPE_SECRET_KEY} // required for Apple Pay
                  urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                >
                  <PaymentScreen
                    productinfo={productInfo}
                    isChecked={isChecked}
                    setCardDetails={setCardDetails}
                    HandlePayment={HandlePayment}
                  />
                </StripeProvider>
                {/* <TouchableOpacity style={styles.applybtn} onPress={() => fetchTokenProvider()}><Text style={styles.applytext}> ${productInfo ? productInfo.voucher_offer_price : null} {'\n'} Pay now </Text></TouchableOpacity> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};
export default Checkout;
