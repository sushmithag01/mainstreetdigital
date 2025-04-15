import React, {useState} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../Common.css';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Utils/Loader';

function RedeemSuccess() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    return (
      <>
        {loading ? <Loader loading={loading} /> : ''}
        <ScrollView>
          <View style={styles.space50}></View>
          <View style={[styles.redeemmain, styles.verfimain, styles.thankimg]}>
            <Image
              source={require('../assets/thank.png')}
              style={styles.thankimg}></Image>
          </View>
          <Text style={[styles.thankyoutitle,{fontSize:18}]}>
            Your voucher has been scucessfully redeemed.
          </Text>
          <View style={styles.thankcontent}>
            {/* <Text style={[styles.label, styles.blacktext, styles.textcenter]}>
              Thank you for choosing Shop Local Digital. Your purchase details has
              been sent to your registered email and is available under "My
              Account" for redeeming.
            </Text> */}
            <View style={styles.space20}></View>
            <View style={[styles.thankbtnmain, styles.deatilsbtninner]}>
              <TouchableOpacity
                 style={{
                  backgroundColor: '#E66100',
                  width: 200,
                  alignItems: 'center',
                  borderRadius: 10,
                }}
                onPress={() =>
                  navigation.replace('Account', {
                    screen: 'Account',
                    params: {selected_index: 0},
                  })
                }>
                <Text style={[styles.applytext,{padding:8,fontSize:18,padding
                  :20
                }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </>
    );
}

export default RedeemSuccess