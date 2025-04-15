import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
} from 'react-native';
import styles from '../Common.css';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PopularDeals from './PopularDeals';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {RelatedDealsVoucherApi} from '../Utils/Api/RelatedDealsVoucherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VoucherDetailApi} from '../Utils/Api/VoucherdetailApi';
import Share from 'react-native-share';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CheckoutApi} from '../Utils/Api/CheckoutApi';
import {Snackbar} from 'react-native-paper';
import {SessionTimeOut} from '../Utils/ErrorMessage';
import Loader from '../Utils/Loader';
import Toast from 'react-native-root-toast';
import HTML from 'react-native-render-html';
import {DateFormatter, getAddressString} from '../Utils/Validations';

let city;
let user_id;
let useremail;
async function getcityid() {
  city = await AsyncStorage.getItem('city_id');
  user_id = await AsyncStorage.getItem('userId');
  useremail = await AsyncStorage.getItem('userEmail');
}
const VoucherDetail = ({route}) => {
  const regex = /<[^>]*>/gm;
  const screenWidth = Dimensions.get('window').width;
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const pageName = route.params.state.pageName;
  const routeParams = route.params.state.product;
  let populardeals_data = '';
  const navigation = useNavigation();
  const [voucherRelatedList, setVoucherRelatedList] = useState([]);
  const isFocused = useIsFocused();
  const [RouteParams, setRouteParams] = useState('');
  const [productDetail, setProductDetail] = useState([]);
  const [city_id, setCityid] = useState();
  const [ProductDescription, setProductDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [toastMsg, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [voucherImage, setVoucherImage] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState(false);
  const [business_hours, setBusinessHours] = useState([]);

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
                  Voucher Detail
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ),
      });
      getcityid().then(() => {
        setRouteParams(routeParams);
        setUserId(user_id);
        setUserEmail(useremail);
        setCityid(city);
      });
    }
  }, [RouteParams, isFocused]);
  useEffect(() => {
    if (isFocused) {
      VoucherDetailshandler();
    }
  }, [RouteParams, isFocused]);

  const handleBackBtn = data => {
    {
      pageName === 'explore' || pageName === 'checkout'
        ? navigation.navigate('Explore') //Any custom code here
        : navigation.navigate('Account', {
            params: {selected_index: 0},
          });
    }
  };

  populardeals_data = {
    business_id: RouteParams.business_id,
    city_id: city_id,
    product_id: RouteParams.city_product_id,
    product_flag: RouteParams.flag,
  };

  const VoucherDetailshandler = async () => {
    setProductDetail([]);
    setProductDescription('');
    setBusinessDescription('');
    setVoucherImage('');
    setLoading(true);
    if (pageName === 'explore') {
      let vid = {
        eu_id: await AsyncStorage.getItem('userId'),
        voucherId: route.params.state.product.city_product_id,
      };
      const voucherdetailData = await VoucherDetailApi(vid);
      try {
        if (voucherdetailData.status === 200) {
          setProductDetail(voucherdetailData.res[0]);
          setProductDescription(voucherdetailData.res[0].voucher_description);
          setBusinessDescription(voucherdetailData.res[0].about_business);
          setVoucherImage(voucherdetailData.res[0].voucher_image);
          setAppointmentStatus(voucherdetailData.res[0].appointment_status);
          setBusinessHours(voucherdetailData.res[0].business_hours);
        } else if (voucherdetailData.status === 429) {
          navigation.navigate('Explore');
          Toast.show(voucherdetailData.message, {
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
        }
      } catch (error) {
        console.log('error', error);
      }
    } else if (pageName == 'checkout') {
      let vid = {
        eu_id: await AsyncStorage.getItem('userId'),
        voucherId: route.params.state.product.city_voucher_id,
      };
      const voucherdetailData = await VoucherDetailApi(vid);
      try {
        if (voucherdetailData.res) {
          setProductDetail(voucherdetailData.res[0]);
          setProductDescription(voucherdetailData.res[0].voucher_description);
          setBusinessDescription(voucherdetailData.res[0].about_business);
          setVoucherImage(voucherdetailData.res[0].voucher_image);
          setAppointmentStatus(voucherdetailData.res[0].appointment_status);
          setBusinessHours(voucherdetailData.res[0].business_hours);
        } else if (voucherdetailData.status === 429) {
          navigation.navigate('Explore');
          Toast.show(voucherdetailData.message, {
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
      } catch (error) {}
    } else {
      let vid = {
        voucherId: route.params.state.product.end_user_product_id,
        product_id: route.params.state.product.product_id,
        recent_id: RouteParams.recent_id,
        eu_id: await AsyncStorage.getItem('userId'),
      };
      const voucherdetailData = await VoucherDetailApi(vid);
      try {
        if (voucherdetailData.res) {
          setProductDetail(voucherdetailData.res[0]);
          setProductDescription(voucherdetailData.res[0].voucher_description);
          setBusinessDescription(voucherdetailData.res[0].about_business);
          setVoucherImage(voucherdetailData.res[0].voucher_image);
          setAppointmentStatus(voucherdetailData.res[0].appointment_status);
          setBusinessHours(voucherdetailData.res[0].business_hours);
        } else if (voucherdetailData.status === 429) {
          navigation.navigate('Explore');
          Toast.show(voucherdetailData.message, {
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
      } catch (error) {}
    }
    setLoading(false);
    // const otherdealsData = await OtherDealsApi(otherdata);
    const relateddealsData = await RelatedDealsVoucherApi(populardeals_data);
    if (relateddealsData.stauts === 429) {
      navigation.navigate('Explore');
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
    }
    setVoucherRelatedList(relateddealsData);
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
  const businessHours = (a, b) => {
    if (a === '00:00:00' && b === '00:00:00') {
      return 'Closed';
    } else if (a && b) {
      return tConv24(a) + ' to ' + tConv24(b);
      // return 'Opened';
    }
  };
  const HandleContactSeller = () => {
    let CommunityId =
      'msd_' +
      userId +
      '_' +
      productDetail.flag +
      '_' +
      productDetail.eu_voucher_id;
    let route_params_data = {
      pageName: 'ContactSeller',
      channel_id: CommunityId,
      flag: productDetail.flag,
      product_id: productDetail.eu_voucher_id,
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
    // navigation.navigate('ContactSeller', { state: { id: productDetail.voucher_id, flag: productDetail.flag, business_id: productDetail.business_id, product_name: productDetail.voucher_title, business_name: productDetail.business_name } });
  };
  const ShareHandler = async () => {
    const shareOptions = {
      title: productDetail.business_name,
      message: 'Please check this out:',
      url: productDetail.voucher_share_url,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error while sharing:', error);
    }
  };

  const HandleCheckOut = async () => {
    const payload = {
      voucher_id: productDetail.city_voucher_id,
      mms_city_id: productDetail.mms_city_id,
      user_id: userId,
    };
    const checkOutRes = await CheckoutApi(payload);
    // console.log("checkOutRes",checkOutRes,payload)
    if (checkOutRes.stauts === 200) {
      navigation.navigate('Checkout', {
        state: {productdetail: checkOutRes.data},
      });
    } else {
      if (checkOutRes.status === 429) {
        navigation.navigate('Explore');
        Toast.show(checkOutRes.message, {
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
        checkOutRes.message === 'Token is invalid!' ||
        checkOutRes.message === 'Request failed with status code 403'
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
        Toast.show(checkOutRes.message, {
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

  const allClosed = business_hours.every(
    item =>
      item.opening_time === '00:00:00' && item.closing_time === '00:00:00',
  );
  // console.log(!allClosed, 'BusinessHours');

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
      {loading ? <Loader loading={loading} /> : null}
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
          {productDetail ? productDetail?.business_name : ''}
        </Text>
        <View style={styles.mainbanner}>
          <>
            <ImageBackground
              source={
                productDetail?.bup_banner
                  ? {uri: productDetail.bup_banner}
                  : require('../assets/banner1.png')
              }
              resizeMode="cover"
              style={styles.banner}
              imageStyle={{borderRadius: 6}}></ImageBackground>
          </>
        </View>

        <View style={styles.deatilbadgemain}>
          <Image
            source={
              voucherImage
                ? {
                    uri: voucherImage,
                  }
                : route.params.state.product.product_image
                ? {uri: route.params.state.product.product_image}
                : require('../assets/card.png')
            }
            style={styles.detailbanner}></Image>
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
            {productDetail ? productDetail.voucher_title : null}
          </Text>
          <Text style={styles.cardtext3}>
            by {productDetail ? productDetail.business_name : ''}
          </Text>
          <View style={styles.pricemain}>
            <Text style={styles.cardtext4}>
              ${productDetail ? productDetail.voucher_actual_price : 0}
            </Text>
            <Text style={styles.cardtext5}>
              ${productDetail ? productDetail.voucher_offer_price : 0}
            </Text>
            <Text style={styles.cardtext6}>
              {productDetail ? productDetail.offered_percent : 0}% OFF
            </Text>
          </View>

          <View style={styles.containerDate}>
            <View style={styles.contentContainerDate}>
              <Text style={styles.textDate}>
                {' '}
                Available Until:{' '}
                {productDetail
                  ? DateFormatter(productDetail.voucher_avail_until_date)
                  : ''}
              </Text>
            </View>
          </View>
          <View style={{width: 200, justifyContent: 'center',alignContent:'center'}}>
            {productDetail && productDetail.expire_days > 0 ? (
              <Text style={[styles.cardtext7,{textAlign:'center'}]}>
                Expires In : {productDetail.expire_days} Days{' '}
              </Text>
            ) : null}
          </View>
          <View style={[styles.containerDate, {paddingBottom: 8}]}>
            <View style={styles.contentContainerDate}>
              <Text style={styles.deatiltitle}>Expiration Date:</Text>
              <Text
                style={{
                  fontSize: 14,
                  paddingLeft: 5,
                  fontWeight: '700',
                  color: '#000',
                }}>
                {DateFormatter(productDetail.voucher_end_date)}{' '}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.deatiltitle}>About this deal: </Text>
          </View>
          {/* <ScrollView style={{flex: 1, paddingHorizontal: 2}}> */}
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
                },

                // Add more styles for other tags as needed to remove extra space
              }}
            />
          </View>
          {/* </ScrollView> */}
          {productDetail && productDetail.voucher_term_condition ? (
            <View>
              <Text style={styles.detailtitlemain}>
                <Text style={styles.deatiltitle}>Terms & Conditions: </Text>
              </Text>
              <View>
                <FlatList
                  data={productDetail.voucher_term_condition}
                  renderItem={({item}) => {
                    return (
                      <View style={{marginBottom: 10}}>
                        <Text
                          style={{
                            fontSize: 16,
                            // fontWeight: '500',
                            marginLeft: 20,
                            // fontFamily: 'Montserrat-Medium',
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
              About {productDetail ? productDetail.business_name : ''} :{' '}
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
            {appointmentStatus === 'True' ? (
              <Text style={styles.bushours}>
                We accept clients by appointment only.
              </Text>
            ) : null}
            {business_hours && business_hours && !allClosed ? (
              <Text>
                <FlatList
                  data={business_hours}
                  renderItem={item => renderBusinessHours(item)}
                />
              </Text>
            ) : null}

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
              {productDetail && productDetail.bup_country
                ? productDetail.bup_state
                : null}
              ,{' '}
              {productDetail && productDetail.bup_state
                ? productDetail.bup_country
                : null}
            </Text> */}
            <Text style={styles.detailtitlemain}>
              <Text style={styles.deatiltitle}>Address: </Text>
              {getAddressString(productDetail)}
            </Text>
          </View>

          {/* <Text style={styles.detailtitlemain}><Text style={styles.deatiltitle}>Address Line 2 : </Text> {productDetail ? productDetail.bup_address2 : null}</Text> */}

          {/* <Text style={styles.detailtitlemain}>
            <Text style={styles.deatiltitle}>Online : </Text>
            {productDetail ? productDetail.website_url : null}
          </Text> */}

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
          {voucherRelatedList && voucherRelatedList.length ? (
            <PopularDeals popularDealsList={voucherRelatedList} />
          ) : null}
          <View style={styles.space50}></View>
        </View>
      </ScrollView>
      {productDetail ? (
        <View>
          <View style={styles.BtnContainer}>
            <View style={styles.BtnView1}>
              <TouchableOpacity onPress={()=>ShareHandler()}>
                <Text style={styles.BtnText1}>Share This Deal</Text>
              </TouchableOpacity>
            </View>
            {productDetail &&
            productDetail.redeem_status == 1 &&
            routeParams.expire_days > 0 ? (
              <View style={styles.BtnView2}>
                <TouchableOpacity>
                  <Text style={styles.BtnText2}>Redeemed</Text>
                </TouchableOpacity>
              </View>
            ) : productDetail &&
              productDetail.redeem_status == 0 &&
              routeParams.expire_days >= 0 ? (
              <View style={styles.BtnView2}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Redeem', {
                      state: {
                        productdetail: productDetail,
                        RouteParams: routeParams,
                      },
                    })
                  }>
                  <Text style={styles.BtnText2}>Redeem</Text>
                </TouchableOpacity>
              </View>
            ) : productDetail && productDetail.expire_days < 0 ? null : (
              <View style={styles.BtnView2}>
                <TouchableOpacity onPress={() => HandleCheckOut()}>
                  <Text style={styles.BtnText2}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ) : null}
    </>
  );
};
const productDesstyles = StyleSheet.create({
  p: {
    color: '#fff',
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});
const tagsStyles = {
  p: {
    display: 'none', // Hide empty <p> tags
  },
  br: {
    display: 'none', // Hide empty <br> tags
  },
};
export default VoucherDetail;
