import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyCouponCard = ({myAccountData, FilterVal}) => {
  const navigation = useNavigation();
  const [data_info, setData] = useState([]);
  const [filter_val, setfilterVal] = useState('0');
  useEffect(() => {
    // const interval = setInterval(() => {
    setData(myAccountData);
    setfilterVal(FilterVal);
    //   }, 1500);
    //   return () => clearInterval(interval);
  }, [FilterVal, myAccountData, data_info]);

  const HandleClick = item => {
    navigation.navigate('CouponDetail', {
      state: {product: item.item, PageName: 'mycoupon'},
    });
  };

  const filteredData = data_info.filter(item => {
    if (filter_val === '1')
      return item.expire_days >= 0 && item.product_redeem_status == 0;
    if (filter_val === '2')
      return item.expire_days > 0 && item.product_redeem_status == 1;
    if (filter_val === '3') return item.expire_days < 0;
    return true;
  });

  const renderItem = item => {
    console.log(item.item.product_redeem_status, 'products');
    if (
      filter_val == 1 &&
      item.item.expire_days >= 0 &&
      item.item.product_redeem_status == 0
    ) {
      //Available coupons
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              {item && item.item.product_image ? (
                <Image
                  source={{uri: item.item.product_image}}
                  style={styles.cardimg}></Image>
              ) : (
                <Image
                  source={require('../assets/card.png')}
                  style={styles.cardimg}></Image>
              )}
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {/* <ImageBackground source={require('../assets/batch.png')} resizeMode="cover" style={styles.image}>
                        <Text style={styles.text}>VOUCHER</Text>
                        </ImageBackground> */}
                {item.item && item.item.expire_days > 0 ? (
                  // && item.item.expire_days <= 7
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline"></MaterialCommunityIcons>
                    {item.item ? item.item.expire_days : null} days
                  </Text>
                ) : null}
              </View>
              <Text style={styles.cardtext1}>
                Coupon ID : {item.item ? item.item.product_code : null}
              </Text>
              <Text style={styles.cardtext2}>
                {item.item ? item.item.product_name : null}
              </Text>
              <Text style={styles.cardtext3}>
                by {item.item ? item.item.business_name : null}
              </Text>
              <Text style={styles.cardtext1}>
                Downloaded Date : {item.item ? item.item.purchase_date : null}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (
      filter_val == 2 &&
      item.item.expire_days > 0 &&
      item.item.product_redeem_status == 1
    ) {
      //used coupons
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              {item && item.item.product_image ? (
                <Image
                  source={{uri: item.item.product_image}}
                  style={styles.cardimg}></Image>
              ) : (
                <Image
                  source={require('../assets/card.png')}
                  style={styles.cardimg}></Image>
              )}
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {/* <ImageBackground source={require('../assets/batch.png')} resizeMode="cover" style={styles.image}>
                        <Text style={styles.text}>VOUCHER</Text>
                        </ImageBackground> */}
                {item.item && item.item.expire_days > 0 ? (
                  // && item.item.expire_days <= 7
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline"></MaterialCommunityIcons>
                    {item.item ? item.item.expire_days : null} days
                  </Text>
                ) : null}
              </View>
              <Text style={styles.cardtext1}>
                Coupon ID : {item.item ? item.item.product_code : null}
              </Text>
              <Text style={styles.cardtext2}>
                {item.item ? item.item.product_name : null}
              </Text>
              <Text style={styles.cardtext3}>
                by {item.item ? item.item.business_name : null}
              </Text>
              <Text style={styles.cardtext1}>
                Downloaded Date : {item.item ? item.item.purchase_date : null}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (filter_val == 3 && item.item.expire_days < 0) {
      // expired coupons
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              {item && item.item.product_image ? (
                <Image
                  source={{uri: item.item.product_image}}
                  style={styles.cardimg}></Image>
              ) : (
                <Image
                  source={require('../assets/card.png')}
                  style={styles.cardimg}></Image>
              )}
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {/* <ImageBackground source={require('../assets/batch.png')} resizeMode="cover" style={styles.image}>
                        <Text style={styles.text}>VOUCHER</Text>
                        </ImageBackground> */}
                {item.item && item.item.expire_days > 0 ? (
                  // && item.item.expire_days <= 7
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline"></MaterialCommunityIcons>
                    {item.item ? item.item.expire_days : null} days
                  </Text>
                ) : null}
              </View>
              <Text style={styles.cardtext1}>
                Coupon ID : {item.item ? item.item.product_code : null}
              </Text>
              <Text style={styles.cardtext2}>
                {item.item ? item.item.product_name : null}
              </Text>
              <Text style={styles.cardtext3}>
                by {item.item ? item.item.business_name : null}
              </Text>
              <Text style={styles.cardtext1}>
                Downloaded Date : {item.item ? item.item.purchase_date : null}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (filter_val == 0) {
      // all
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              {item && item.item.product_image ? (
                <Image
                  source={{uri: item.item.product_image}}
                  style={styles.cardimg}></Image>
              ) : (
                <Image
                  source={require('../assets/card.png')}
                  style={styles.cardimg}></Image>
              )}
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {/* <ImageBackground source={require('../assets/batch.png')} resizeMode="cover" style={styles.image}>
                        <Text style={styles.text}>VOUCHER</Text>
                        </ImageBackground> */}
                {item.item &&
                item.item.expire_days > 0 &&
                item.item.expire_days <= 70 &&
                item.item.product_redeem_status == 0 ? (
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline"></MaterialCommunityIcons>
                    {item.item ? item.item.expire_days : null} days
                  </Text>
                ) : null}
              </View>
              <Text style={styles.cardtext1}>
                Coupon ID : {item.item ? item.item.product_code : null}
              </Text>
              <Text style={styles.cardtext2}>
                {item.item ? item.item.product_name : null}
              </Text>
              <Text style={styles.cardtext3}>
                by {item.item ? item.item.category_name : null}
              </Text>
              <Text style={styles.cardtext1}>
                Downloaded Date : {item.item ? item.item.purchase_date : '-'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const NoDataComponent = () => (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        margin: 70,
      }}>
      No Data Available..!!
    </Text>
  );

  return (
    <>
      <SafeAreaView horizontal={true} style={{flex: 1}}>
        <ScrollView>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.product_id}
            ListEmptyComponent={NoDataComponent}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MyCouponCard;
