import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyVoucherCard = ({myAccountData, FilterVal}) => {
  const navigation = useNavigation();
  const [data_info, setData] = useState([]);
  const [filter_val, setFilterVal] = useState('0');

  useEffect(() => {
    setFilterVal(FilterVal);
    setData(myAccountData);
  }, [myAccountData, FilterVal]);

  const HandleClick = item => {
    navigation.navigate('VoucherDetail', {
      state: {product: item, pageName: 'myvoucher'},
    });
  };

  const filteredData = data_info.filter(item => {
    if (filter_val === '1')
      return item.expire_days > 0 && item.product_redeem_status == 0;
    if (filter_val === '2')
      return item.expire_days > 0 && item.product_redeem_status == 1;
    if (filter_val === '3') return item.expire_days <= 0;
    return true;
  });

  
  const renderItem = ({item}) => {
    // Available voucher
    if (
      filter_val === '1' &&
      item.expire_days >= 0 &&
      item.product_redeem_status == 0
    ) {
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              <Image
                source={
                  item.product_image
                    ? {uri: item.product_image}
                    : require('../assets/card.png')
                }
                style={styles.cardimg}
              />
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {item.expire_days > 0 && item.expire_days <= 70 && (
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline" />{' '}
                    {item.expire_days} days
                  </Text>
                )}
              </View>
              <Text style={styles.cardtext1}>
                Voucher ID : {item.product_code}
              </Text>
              <Text style={styles.cardtext1}>
                Transaction ID : {item.transaction_id}
              </Text>
              <Text style={styles.cardtext2}>{item.product_name}</Text>
              <Text style={styles.cardtext3}>by {item.business_name}</Text>
              <View style={styles.pricemain}>
                <Text style={styles.cardtext4}>
                  ${item.voucher_actual_price}
                </Text>
                <Text style={styles.cardtext5}>
                  ${item.voucher_offer_price}
                </Text>
              </View>
              <Text style={styles.cardtextPrice}>
                Purchased Price : ${item.voucher_offer_price}
              </Text>
              <Text style={styles.cardtext1}>
                Purchase Date : {item.purchase_date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    // Redeemed voucher
    else if (
      filter_val === '2' &&
      item.expire_days > 0 &&
      item.product_redeem_status == 1
    ) {
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              <Image
                source={
                  item.product_image
                    ? {uri: item.product_image}
                    : require('../assets/card.png')
                }
                style={styles.cardimg}
              />
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {item.expire_days > 0 && item.expire_days <= 7 && (
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline" />{' '}
                    {item.expire_days} days
                  </Text>
                )}
              </View>
              <Text style={styles.cardtext1}>
                Voucher ID : {item.product_code}
              </Text>
              <Text style={styles.cardtext1}>
                Transaction ID : {item.transaction_id}
              </Text>
              <Text style={styles.cardtext2}>{item.product_name}</Text>
              <Text style={styles.cardtext3}>by {item.business_name}</Text>
              <View style={styles.pricemain}>
                <Text style={styles.cardtext4}>
                  ${item.voucher_actual_price}
                </Text>
                <Text style={styles.cardtext5}>
                  ${item.voucher_offer_price}
                </Text>
              </View>
              <Text style={styles.cardtextPrice}>
                Purchased Price : ${item.voucher_offer_price}
              </Text>
              <Text style={styles.cardtext1}>
                Purchase Date : {item.purchase_date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    // Expired voucher
    else if (filter_val === '3' && item.expire_days < 0) {
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              <Image
                source={
                  item.product_image
                    ? {uri: item.product_image}
                    : require('../assets/card.png')
                }
                style={styles.cardimg}
              />
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {item.expire_days > 0 && item.expire_days <= 7 && (
                  <Text style={[styles.cardtext7, styles.expirebtn]}>
                    <MaterialCommunityIcons name="clock-outline" />{' '}
                    {item.expire_days} days
                  </Text>
                )}
              </View>
              <Text style={styles.cardtext1}>
                Voucher ID : {item.product_code}
              </Text>
              <Text style={styles.cardtext1}>
                Transaction ID : {item.transaction_id}
              </Text>
              <Text style={styles.cardtext2}>{item.product_name}</Text>
              <Text style={styles.cardtext3}>by {item.business_name}</Text>
              <Text style={styles.cardtextPrice}>
                Purchased Price : ${item.voucher_offer_price}
              </Text>
              <Text style={styles.cardtext1}>
                Purchase Date : {item.purchase_date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    // All vouchers (filter_val == 0)
    else if (filter_val == 0) {
      return (
        <TouchableOpacity onPress={() => HandleClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              <Image
                source={
                  item.product_image
                    ? {uri: item.product_image}
                    : require('../assets/card.png')
                }
                style={styles.cardimg}
              />
            </View>
            <View style={styles.cardinnerright}>
              <View style={[styles.badgecontainer, styles.expires]}>
                {item.expire_days > 0 &&
                  item.expire_days <= 70 &&
                  item.product_redeem_status === 0 && (
                    <Text style={[styles.cardtext7, styles.expirebtn]}>
                      <MaterialCommunityIcons name="clock-outline" />{' '}
                      {item.expire_days} days
                    </Text>
                  )}
              </View>
              <Text style={styles.cardtext1}>
                Voucher ID : {item.product_code}
              </Text>
              <Text style={styles.cardtext1}>
                Transaction ID : {item.transaction_id}
              </Text>
              <Text style={styles.cardtext2}>{item.product_name}</Text>
              <Text style={styles.cardtext3}>by {item.business_name}</Text>
              <View style={styles.pricemain}>
                <Text style={styles.cardtext4}>
                  ${item.voucher_actual_price}
                </Text>
                <Text style={styles.cardtext5}>
                  ${item.voucher_offer_price}
                </Text>
              </View>
              <Text style={styles.cardtextPrice}>
                Purchased Price : ${item.voucher_offer_price}
              </Text>
              <Text style={styles.cardtext1}>
                Purchase Date : {item.purchase_date}
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
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={data_info}
        renderItem={renderItem}
        keyExtractor={item => item.product_code || item.transaction_id}
        ListEmptyComponent={NoDataComponent}
      />
    </SafeAreaView>
  );
};

export default MyVoucherCard;
