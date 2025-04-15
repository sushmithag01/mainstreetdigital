import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';

const SliderCard = ({populardeals, key}) => {
  const navigation = useNavigation();
  const [popularDelas, setpopularDeals] = useState([]);

  useEffect(() => {
    setpopularDeals(populardeals);
  }, [populardeals]);

  const HandelClick = item => {
    if (item.flag === 'Voucher') {
      navigation.navigate('VoucherDetail', {
        state: {product: item, pageName: 'explore'},
      });
    } else {
      navigation.navigate('CouponDetail', {
        state: {product: item, pageName: 'explore'},
      });
    }
  };

  return (
    <>
      <View style={styles.cardmainpopular}>
        <View style={styles.cardinnerright1}>
          {/* <Image source={require('../assets/gvvv.png')} style={styles.cardimg1}></Image> */}
          {popularDelas && popularDelas.product_image ? (
            <Image
              source={{uri: popularDelas.product_image}}
              style={styles.cardimg1}></Image>
          ) : (
            <Image
              source={require('../assets/card1.png')}
              style={styles.cardimg1}></Image>
          )}
          <View>
            <View style={[styles.badgecontainer, styles.badgecontainer1]}>
              <ImageBackground
                source={require('../assets/batch.png')}
                resizeMode="cover"
                style={styles.image}>
                <Text style={styles.text}>{popularDelas.flag}</Text>
              </ImageBackground>
            </View>
            <Text style={[styles.cardtext1, styles.popcard1]} numberOfLines={2}>
              {popularDelas.category}
            </Text>
            <TouchableOpacity onPress={() => HandelClick(popularDelas)}>
              <Text
                style={[styles.cardtext2, styles.cardtext22]}
                numberOfLines={1}>
                {popularDelas.product_name}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.cardtext3]} numberOfLines={1}>
              by {popularDelas.business_name}
            </Text>
            {popularDelas.flag !== 'Coupon' ? (
              <View style={styles.pricemain}>
                <Text style={styles.cardtext4}>
                  ${popularDelas.product_actual_price}
                </Text>
                <Text style={styles.cardtext5}>
                  ${popularDelas.product_offer_price}
                </Text>
                <Text style={styles.cardtext6}>
                  {popularDelas.offered_percent}% OFF
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </>
  );
};

export default SliderCard;
