import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';

const LatestLocalCard = ({list_ofExplore,viewAll}) => {
  const navigation = useNavigation();
  const [exploreList, setExploreList] = useState('');
  useEffect(() => {
    setExploreList(list_ofExplore);
  }, [list_ofExplore,viewAll]);
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

  const renderItem = item => {
    return (
      <>
        <TouchableOpacity onPress={() => HandelClick(item)}>
          <View style={styles.cardmain}>
            <View style={styles.cardinnerleft}>
              {item.product_image ? (
                <Image
                  source={{uri: item.product_image}}
                  style={styles.cardimg}></Image>
              ) : (
                <Image
                  source={require('../assets/card.png')}
                  style={styles.cardimg}></Image>
              )}
            </View>
            <View style={styles.cardinnerright}>
              <View style={styles.badgecontainer}>
                <ImageBackground
                  source={require('../assets/batch.png')}
                  resizeMode="cover"
                  style={styles.image}>
                  <Text style={styles.text}>{item.flag}</Text>
                </ImageBackground>
              </View>
              <Text style={styles.cardtext1} numberOfLines={1}>
                {item.category}
              </Text>
              <Text style={styles.cardtext2} numberOfLines={1}>
                {item.product_name}
              </Text>
              <Text style={styles.cardtext3} numberOfLines={1}>
                by {item.business_name}
              </Text>
              {item.flag === 'Voucher' ? (
                <View style={styles.pricemain}>
                  <Text style={styles.cardtext4}>
                    ${item.product_actual_price}
                  </Text>
                  <Text style={styles.cardtext5}>
                    ${item.product_offer_price}
                  </Text>
                  <Text style={styles.cardtext6}>
                    {item.offered_percent}% OFF
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <>
      <SafeAreaView horizontal={true} style={{flex: 1}}>
        <ScrollView>
          {exploreList ? (
            <FlatList
              data={viewAll ?exploreList.slice(0, 4):exploreList}
              renderItem={({item, index}) => renderItem(item)}
              keyExtractor={item => item.product_id}
            />
          ) : (
            <Text style={{textAlign: 'center', fontSize: 16}}>
              No Data Available
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default LatestLocalCard;
