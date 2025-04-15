import React, {useState, useEffect} from 'react';
import {Dimensions, View, Image, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const ExploreSlider = ({props, bannerImage}) => {
  const width = Dimensions.get('window').width;
  const [bannerImageList, setBannerImages] = useState([]);
  useEffect(() => {
    setBannerImages(bannerImage);
  }, [bannerImage]);

  return (
    <>
      <View style={{flex: 1, marginTop: 10}}>
        <Carousel
          loop
          mode={'parallax-horizontal'}
          width={width * 0.95}
          pagingEnabled={true}
          snapEnabled={true}
          height={width * 0.27}
          autoPlay={true}
          data={bannerImageList}
          scrollAnimationDuration={8000}
          renderItem={({index, item}) => (
            <View
              style={{
                flex: 1,
                margin: 0,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.6,
                shadowRadius: 1.41,
                elevation: 2,
              }}>
              <TouchableOpacity style={{flex: 1, margin: 0}}>
                <Image
                  source={{uri: item}}
                  style={{
                    width: '100%',
                    height: 100,
                    borderRadius: 10,
                  }}></Image>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default ExploreSlider;
