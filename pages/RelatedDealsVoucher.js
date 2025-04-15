import styles from '../Common.css';
import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SliderCard from './SliderCard';

const RelatedDealsVoucher = ({popularDealsList}) => {
  const [populardeals_data, setpopularDealsList] = useState([]);
  const width = Dimensions.get('window').width;
  useEffect(() => {
    setpopularDealsList(popularDealsList);
  }, [popularDealsList]);

  return (
    <>
      <View style={styles.space20}></View>
      <View style={[styles.titlemain, styles.populartitle]}>
        <Text style={[styles.title]}>Popular Deals</Text>
      </View>
      <View style={{}}>
        <Carousel
          loop
          mode={'parallax'}
          width={width * 0.95}
          pagingEnabled={true}
          snapEnabled={true}
          height={width * 1 * 1}
          autoPlay={false}
          data={populardeals_data}
          scrollAnimationDuration={1000}
          snapDirection="left"
          renderItem={({item}) => (
            <View style={styles.slidermain}>
              <SliderCard populardeals={item} />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default RelatedDealsVoucher;
