import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import styles from '../Common.css';

const PurchasedVoucherInfo = ({productinfo}) => {
  return (
    <>
      <SafeAreaView horizontal={true} style={{flex: 1}}>
        <ScrollView>
          <TouchableOpacity>
            <View style={styles.cardmain}>
              <View style={styles.cardinnerleft}>
                {productinfo.voucher_image ? (
                  <Image
                    source={{uri: productinfo.voucher_image}}
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
                    <Text style={styles.text}>Voucher</Text>
                  </ImageBackground>
                </View>
                <Text style={styles.cardtext1} numberOfLines={1}>
                  {productinfo.flag}
                </Text>
                <Text style={styles.cardtext2} numberOfLines={1}>
                  {productinfo.voucher_name}
                </Text>
                <Text style={styles.cardtext3} numberOfLines={1}>
                  By {productinfo.business_name}
                </Text>

                <View style={styles.pricemain}>
                  <Text style={styles.cardtext4}>
                    ${productinfo.voucher_actual_price}
                  </Text>
                  <Text style={styles.cardtext5}>
                    ${productinfo.voucher_offer_price}
                  </Text>
                  <Text style={styles.cardtext6}>
                    {productinfo.voucher_discount}% OFF
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default PurchasedVoucherInfo;
