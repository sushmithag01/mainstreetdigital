import styles from '../Common.css';
import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SliderCard from './SliderCard';

const PopularDeals = ({popularDealsList, loading}) => {
  const [populardeals_data, setpopularDealsList] = useState([]);
  const width = Dimensions.get('window').width;
  useEffect(() => {
    setpopularDealsList(popularDealsList);
  }, [popularDealsList]);

  return (
    <>
      <View style={styles.space20}></View>
      <View style={{marginBottom: 100}}>
        <View style={[styles.titlemain, styles.populartitle]}>
          <Text style={[styles.title, styles.marbottom40]}>
            Deals you may like
          </Text>
        </View>
        {loading ? (
          <View style={{marginTop: 100, marginBottom: 40}}>
            <ActivityIndicator />
          </View>
        ) : populardeals_data && populardeals_data.length > 0 ? (
          <View style={{width: '80%', marginLeft: '10%', marginRight: '10%'}}>
            <Carousel
              loop
              // mode={'left-align'}
              // width={width * 0.95}
              width={width - 20}
              height={width * 1.4}
              style={{width: '100%'}}
              pagingEnabled={true}
              snapEnabled={false}
              // height={width * 1.3}
              autoPlay={true}
              data={populardeals_data}
              scrollAnimationDuration={5000}
              // snapDirection='left'
              renderItem={({item, index}) => (
                <View style={styles.slidermain}>
                  <SliderCard populardeals={item} key={index} />
                </View>
              )}
            />
          </View>
        ) : (
          <Text
            style={{textAlign: 'center', fontWeight: '800', marginTop: 100}}>
            {' '}
            No Data Available..!!
          </Text>
        )}
      </View>
    </>
  );
};
export default PopularDeals;
