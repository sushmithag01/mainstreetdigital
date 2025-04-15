import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  FlatList,
  // Share,
  Dimensions,
} from 'react-native';
import styles from '../Common.css';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PopularDeals from './PopularDeals';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {RelatedDealsVoucherApi} from '../Utils/Api/RelatedDealsVoucherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CouponDetailApi} from '../Utils/Api/CouponDetailApi';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import {CouponsDownloadAPI} from '../Utils/Api/CouponsDownloadApi';
import {RedeemCopounApi} from '../Utils/Api/RedeemCouponApi';
import Toast from 'react-native-root-toast';
import {Snackbar} from 'react-native-paper';
import Loader from '../Utils/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import HTML from 'react-native-render-html';
import {DateFormatter, getAddressString} from '../Utils/Validations';

let city;
let user_id;
async function getcityid() {
  city = await AsyncStorage.getItem('city_id');
  user_id = await AsyncStorage.getItem('userId');
}
const CouponDetail = ({route}) => {
  const screenWidth = Dimensions.get('window').width;
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  let populardeals_data = '';
  const regex = /(<([^>]+)>)/gi;
  const pageName = route.params.state.pageName;
  const routeParams = route.params.state.product;
  const navigation = useNavigation();
  const [relateddataList, setRelatedData] = useState([]);
  const isFocused = useIsFocused();
  const [RouteParams, setRouteParams] = useState('');
  const [productDetail, setProductDetail] = useState([]);
  const [city_id, setCityid] = useState();
  const [ProductDescription, setProductDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [showCopyCode, setShowCopyCode] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [downloadStatus, SetDownloadStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponImage, setCouponImage] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString(productDetail.coupon_code);
    Toast.show(productDetail.coupon_code + 'copied successfully..!!', {
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
    setShowCopyCode(false);
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const handleBackBtn = data => {
    {
      pageName === 'explore'
        ? navigation.navigate('Explore')
        : navigation.navigate('Accountt', {
            screen: 'Account',
            params: {selected_index: 1},
          });
    }
  };

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        header: props => (
          <>
            <View style={styles.headerhomesingle}>
              <TouchableOpacity
                style={[styles.backbtnmain, styles.backinnert]}
                onPress={() => handleBackBtn(pageName)}>
                <Ionicons
                  color="#E66100"
                  name="chevron-back"
                  style={styles.backicon}
                  size={23}
                />
                <Text style={styles.backbtntext} numberOfLines={2}>
                  Coupon Detail
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ),
      });

      getcityid().then(() => {
        setCityid(city);
        setUserId(user_id);
      });
      setRouteParams(routeParams);
      CouponDetailshandler();
    }
  }, [RouteParams, isFocused]);
  let CommunityId =
    'msd_' + userId + '_' + RouteParams.flag + '_' + RouteParams.business_id;
  // if (pageName == "explore") {
  populardeals_data = {
    business_id: RouteParams.business_id,
    city_id: city_id,
    product_id: RouteParams.city_product_id,
    product_flag: RouteParams.flag,
  };

  const CouponDetailshandler = async () => {
    setLoading(true);
    // if (pageName == "explore") {
    const cid = {
      eu_id: await AsyncStorage.getItem('userId'),
      coupon_id: route.params.state.product.city_product_id,
      recent_id: route.params.state.product.recent_id,
    };
    const coupondetailData = await CouponDetailApi(cid).finally(() => {
      setLoading(false);
    });
    if (coupondetailData.status === 200) {
      setProductDetail(coupondetailData.res[0]);
      setProductDescription(coupondetailData.res[0].coupon_description);
      setBusinessDescription(coupondetailData.res[0].about_business);
      setCouponImage(coupondetailData.res[0].coupon_image);
    } else {
      if (coupondetailData.status === 429) {
        navigation.navigate('Explore');
        Toast.show(coupondetailData.message, {
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
        coupondetailData.message === 'Token is invalid!' ||
        coupondetailData.message === 'Request failed with status code 403'
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
        // Toast.show(coupondetailData.message, {
        //     duration: 6000,
        //     position: 50,
        //     shadow: true,
        //     animation: true,
        //     hideOnPress: true,
        //     delay: 0,
        //     backgroundColor:"#fff",
        //     textColor:'#000000',
        //     opacity: 1,
        // textStyle: {
        //   fontSize: 18,
        //   fontWeight:"500" // Increase the font size here
        // },
        //   });
      }
    }
    // const otherdealsData = await OtherDealsApi(otherdata);
    const relateddealsData = await RelatedDealsVoucherApi(populardeals_data);
    if (relateddealsData.status === 429) {
      setLoading(true);
      Toast.show(relateddealsData.message, {
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
      relateddealsData.message === 'Token is invalid!' ||
      relateddealsData.message === 'Request failed with status code 403'
    ) {
    } else {
      setRelatedData(relateddealsData);
    }
  };
  const HandleContactSeller = () => {
    let CommunityId =
      'msd_' +
      userId +
      '_' +
      productDetail.flag +
      '_' +
      productDetail.eu_coupon_id;
    let route_params_data = {
      pageName: 'ContactSeller',
      channel_id: CommunityId,
      flag: productDetail.flag,
      product_id: productDetail.eu_coupon_id,
      bu_id: productDetail.business_id,
      product_name: RouteParams.product_name,
      business_name: RouteParams.business_name,
    };
    navigation.navigate('Messagess', {
      screen: 'ChatPage',
      params: {
        state: route_params_data,
      },
    });
    // navigation.navigate('ContactSeller', { state: { id: productDetail.coupon_id, flag: productDetail.flag, business_id: productDetail.business_id, product_name: productDetail.coupon_title, business_name: productDetail.business_name } });
  };
  // console.log("productDetail",productDetail);
  const share = async () => {
    const shareOptions = {
      title: productDetail.business_name,
      message: 'Please check this out:',
      url: productDetail.coupon_share_url,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error while sharing:', error);
    }
  };
  const singleShare = async customOptions => {
    try {
      await Share.shareSingle(customOptions);
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowcouponCode = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to see the coupon code? Once you see the code, it will be considered as redeemed.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleRedeemCoupon()},
      ],
    );
    // setShowCopyCode(true);
    // handleRedeemCoupon();
  };

  const handleCouponDownload = async () => {
    setLoading(true);
    const userID = await AsyncStorage.getItem('userId');
    const CityId = await AsyncStorage.getItem('city_id');
    const payload = {
      user_id: parseInt(userID),
      coupon_id: productDetail.city_coupon_id,
      business_id: productDetail.business_id,
      city_id: parseInt(productDetail.mms_city_id),
    };
    // console.log("payload",payload)
    const Response = await CouponsDownloadAPI(payload).finally(() => {
      setLoading(false);
    });
    console.log('Response', Response);
    if (Response.status === 200) {
      CouponDetailshandler(RouteParams);
      SetDownloadStatus(true);
      Toast.show(Response.message, {
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
      CouponDetailshandler(RouteParams);
    } else {
      if (Response.status === 429) {
        Toast.show(Response.message, {
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
        Response.message === 'Token is invalid!' ||
        Response.message === 'Request failed with status code 403'
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
        Toast.show(Response.message, {
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
  // redeem counpon
  const handleRedeemCoupon = async () => {
    const data = {
      user_id: userId,
      coupon_id: productDetail.city_coupon_id,
      recent_id: routeParams.recent_id,
    };

    const redeemres = await RedeemCopounApi(data);
    if (redeemres.status === 200) {
      setShowCopyCode(true);
      CouponDetailshandler(RouteParams);
      Toast.show(redeemres.message, {
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
      if (redeemres.status === 429) {
        navigation.navigate('Account', {params: {selected_index: 1}});
        Toast.show(redeemres.message, {
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
        redeemres.message === 'Token is invalid!' ||
        redeemres.message === 'Request failed with status code 403'
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
        Toast.show(redeemres.message, {
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

  const renderBusinessHours = (item, index) => {
    return (
      <>
        <View>
          <Text style={styles.bushours}>
            {item.item.day} :{' '}
            {businessHours(item.item.opening_time, item.item.closing_time)}
          </Text>
        </View>
      </>
    );
  };

  const businessHours = (a, b) => {
    if (a === '00:00:00' && b === '00:00:00') {
      return 'Closed';
    } else if (a && b) {
      return tConv24(a) + ' to ' + tConv24(b);
      // return 'Opened';
    }
  };
  function tConv24(time24) {
    //18:00:00 to 06:00 PM
    // Check correct time format and split into components
    // console.log(time24);
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? ' AM' : ' PM';
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  function decodeHtmlEntities(input) {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(regex, '')
      .replace(/&#39;/g, "'")
      .replace(/&#38;/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, '—');
  }

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
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
        <Text style={styles.bannertextnew}>
          {productDetail ? productDetail.business_name : ''}
        </Text>
        <View style={styles.mainbanner}>
          {productDetail && productDetail.bup_banner ? (
            <ImageBackground
              source={{uri: productDetail.bup_banner}}
              resizeMode="cover"
              style={styles.banner}
              imageStyle={{borderRadius: 6}}>
              {/* <View style={styles.overlay}>
                                    <Text style={styles.bannertext}>{productDetail ? productDetail.business_name : ""}</Text>
                                </View> */}
            </ImageBackground>
          ) : (
            <ImageBackground
              source={require('../assets/banner1.png')}
              resizeMode="cover"
              style={styles.banner}
              imageStyle={{borderRadius: 6}}>
              <Text style={styles.bannertext}>
                {productDetail ? productDetail.business_name : ''}
              </Text>
            </ImageBackground>
          )}
        </View>
        <View style={styles.deatilbadgemain}>
          {couponImage ? (
            <Image
              source={{
                uri: couponImage,
              }}
              style={styles.detailbanner}
            />
          ) : (
            <Image
              source={require('../assets/card.png')}
              style={styles.detailbanner}></Image>
          )}
          <View style={[styles.badgecontainer, styles.detailbadgecontainer]}>
            <ImageBackground
              source={require('../assets/batch.png')}
              resizeMode="cover"
              style={styles.image}>
              <Text style={styles.text}>
                {productDetail ? productDetail.flag : ''}
              </Text>
            </ImageBackground>
          </View>
          <Text style={styles.cardtext1}>
            {productDetail ? productDetail.category : ''}
          </Text>
          <Text style={styles.cardtext2}>
            {productDetail ? productDetail.coupon_title : null}
          </Text>
          <Text style={styles.cardtext3}>
            by {productDetail ? productDetail.business_name : ''}
          </Text>
          <View
            style={{
              justifyContent: 'flex-start',
              width: 180,
              padding: 5,
            }}></View>
          <View style={styles.containerDateCoupon}>
            <View style={[styles.contentContainerDate, {gap: 3}]}>
              <Text style={styles.textDate}>
                {' '}
                Available Until:{' '}
                {productDetail
                  ? DateFormatter(productDetail.coupon_avail_until_date)
                  : ''}
              </Text>
            </View>
          </View>
          <View style={{width: 200, justifyContent: 'center',marginTop:10,alignContent:'center'}}>
            {productDetail && productDetail.coupon_exp_date > 0 ? (
              <Text style={[styles.cardtext7,{textAlign:'center'}]}>
                Expires In : {productDetail.coupon_exp_date} Days{' '}
              </Text>
            ) : null}
          </View>
          <View style={[styles.containerDate, {paddingTop: 8}]}>
            <View style={styles.contentContainerDate}>
              <Text style={styles.deatiltitle}>Expiration Date:</Text>
              <Text
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  fontWeight: '700',
                  color: '#000',
                }}>
                {DateFormatter(productDetail.coupon_end_date)}{' '}
              </Text>
            </View>
          </View>

          <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>About this deal: </Text>

            {/* {productDetail && ProductDescription
              ? decodeHtmlEntities(ProductDescription)
              : null} */}
          </Text>
          <View
            style={{
              width: screenWidth * 0.75,
              alignSelf: 'flex-start',
              margin: 10,
            }}>
            <HTML
              source={{html: ProductDescription}}
              contentWidth={screenWidth * 0.75}
              baseStyle={{
                color: '#000', // Set default text color to black
                fontSize: 16,
                fontFamily: 'Montserrat-Medium',
                width: screenWidth * 0.95,
              }}
              tagsStyles={{
                ol: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  marginBottom: 0, // Reduce space between items
                  color: '#000',
                  marginVertical: 0,
                },
                li: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  marginBottom: 0, // Adjust space between list items
                  color: '#000',
                  paddingVertical: 2,
                  lineHeight: 24,
                  // wordBreak: 'break-word',
                  // flexWrap: 'wrap',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
                p: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 0, // Remove default paragraph margins
                  paddingVertical: 0, // Remove extra padding if present
                  color: '#000',
                  lineHeight: 24,
                  // wordBreak: 'break-word',
                  // flexWrap: 'wrap',
                },
                div: {
                  marginVertical: 0,
                  paddingVertical: 0,
                  wordBreak: 'break-word',
                  flexWrap: 'wrap',
                  paddingVertical: 0,
                  color: '#000',
                },

                // Add more styles for other tags as needed to remove extra space
              }}
            />
            {/* {productDetail && ProductDescription
              ? decodeHtmlEntities(ProductDescription)
              : null} */}
          </View>
          {/* <Text style={styles.detailtitlemain}><Text style={styles.deatiltitle}>Terms & Conditions : </Text> {productDetail ? productDetail.coupon_term_condition : null}</Text> */}
          {productDetail && productDetail.coupon_term_condition ? (
            <View>
              <Text style={styles.detailtitlemain}>
                <Text style={styles.deatiltitle}>Terms & Conditions: </Text>
              </Text>
              <View>
                <FlatList
                  data={productDetail.coupon_term_condition}
                  renderItem={({item}) => {
                    return (
                      <View style={{marginBottom: 10}}>
                        <Text
                          style={{
                            fontSize: 16,
                            // fontWeight: '500',
                            marginLeft: 20,
                            fontFamily: 'Montserrat-Medium',
                            color: '#000',
                          }}>
                          {`\u2022 ${item}`}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          ) : (
            ''
          )}
          {/* <View style={{flexDirection: 'row',marginTop:10}}>
                <Text style={styles.list1}>{'\u2022'}</Text>
                <Text style={styles.list}>{productDetail.voucher_term_condition[0]}</Text>
            </View>
            <View style={{flexDirection: 'row',marginTop:10}}>
                <Text style={styles.list1}>{'\u2022'}</Text>
                <Text style={styles.list}>{productDetail.voucher_term_condition[1]}</Text>
            </View> */}
          <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>
              About {productDetail ? productDetail.business_name : ''}:{' '}
            </Text>
            {/* {productDetail ? decodeHtmlEntities(businessDescription) : ''}{' '} */}
          </Text>
          <View style={{margin: 10}}>
            <HTML
              source={{html: businessDescription}}
              baseStyle={{
                color: '#000', // Set default text color to black
                fontSize: 16,
                fontFamily: 'Montserrat-Medium',
              }}
              tagsStyles={{
                ol: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  color: '#000',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
                li: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  color: '#000',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
                a: {
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium', // Change link color as needed
                  color: '#000',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
                p: {
                  // textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Montserrat-Medium',
                  color: '#000',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
                div: {
                  marginVertical: 0,
                  paddingVertical: 0,
                  wordBreak: 'break-word',
                  flexWrap: 'wrap',
                  paddingVertical: 0,
                  color: '#000',
                },
                // Add more styles for other tags as needed
              }}
            />
          </View>
          {/* <View style={styles.tagmain}>
                        <View style={styles.taginner}>
                            <Image source={require('../assets/tag.png')} style={styles.tagimg}></Image>
                            <Text style={styles.tagtext}> Women Owned Business</Text>
                        </View>
                    </View> */}
          <Text style={styles.deatiltitlee}>Business hours: </Text>
          <View style={styles.space10}></View>
          <View>
            {productDetail && productDetail.business_hours ? (
              <Text>
                <FlatList
                  data={productDetail.business_hours}
                  renderItem={item => renderBusinessHours(item)}
                />
              </Text>
            ) : null}
          </View>
          {/* <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>Address: </Text>
            {productDetail && productDetail.bup_address1
              ? productDetail.bup_address1
              : null}
            ,{' '}
            {productDetail && productDetail.bup_address2
              ? productDetail.bup_address2
              : null}
            ,{' '}
            {productDetail && productDetail.bup_city
              ? productDetail.bup_city
              : null}
            ,
            {productDetail && productDetail.bup_state
              ? productDetail.bup_state
              : null}
            ,{' '}
            {productDetail && productDetail.bup_country
              ? productDetail.bup_country
              : null}
          </Text> */}

          <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>Address: </Text>
            {getAddressString(productDetail)}
          </Text>

          {/* <Text style={styles.detailtitlemain}><Text style={styles.deatiltitle}>Address Line 2 : </Text> {productDetail ? productDetail.bup_address2 : null}</Text> */}
          <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>Online: </Text>
            {productDetail &&
            productDetail.website_url &&
            productDetail.website_url !== 'None' &&
            productDetail.website_url.trim() !== '' ? (
              productDetail.website_url
            ) : (
              <Text>No data available!</Text>
            )}
          </Text>

          <View style={styles.outlinebuttonmain}>
            <TouchableOpacity
              style={styles.outlinebutton}
              onPress={HandleContactSeller}>
              <Text style={styles.outlinebuttontext}>
                <FontAwesome
                  name="phone"
                  style={styles.outlinebtnicon}
                  size={15}></FontAwesome>{' '}
                Contact Seller
              </Text>
            </TouchableOpacity>
          </View>
          {relateddataList && relateddataList.length ? (
            <PopularDeals popularDealsList={relateddataList} />
          ) : null}
          <View style={styles.space50}></View>
        </View>
      </ScrollView>
      <View>
        <View style={styles.BtnContainer}>
          <View style={styles.BtnView1}>
            <TouchableOpacity style={styles.closebtn}>
              <Text
                style={[styles.closebtntext, styles.orgtext, {fontSize: 18}]}
                onPress={async () => {
                  await share();
                }}>
                Share This Deal
              </Text>
            </TouchableOpacity>
          </View>

          {pageName == 'explore' ? (
            <View style={styles.BtnView2}>
              <TouchableOpacity>
                <Text style={styles.BtnText2} onPress={handleCouponDownload}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {showCopyCode === true ? (
                <View style={styles.BtnView2}>
                  <TouchableOpacity>
                    <Text style={styles.BtnText2} onPress={copyToClipboard}>
                      {productDetail.coupon_code}{' '}
                      <FontAwesome
                        name="copy"
                        style={styles.outlinebtnicon}
                        size={15}></FontAwesome>
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : productDetail && productDetail.redeem_status == 1 ? (
                <View style={styles.BtnView2}>
                  <TouchableOpacity>
                    <Text style={styles.BtnText2}>Redeemed</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.BtnView2}>
                  <TouchableOpacity onPress={handleShowcouponCode}>
                    <Text style={styles.BtnText2}>Show Code</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
};
export default CouponDetail;
