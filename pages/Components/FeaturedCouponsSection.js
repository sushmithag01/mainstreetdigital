import React, { useEffect, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View, Text } from 'react-native';
import styles from "../../Common.css";
import CardsRenderItem from '../RenderComponents/CardsRenderItem';
import { FlatList } from 'react-native';

function FeaturedCouponsSection({ featuredCoupons, setLimitValue ,ExploreHandler}) {
  const [totalCount, setTotalCount] = useState(4);
  const [viewState, setViewState] = useState(true);
  const [featuredCouponsData,setfeaturedCouponsData]=useState([]);
  useEffect(() => {
    setTotalCount(featuredCoupons?.total_count);
    setfeaturedCouponsData(featuredCoupons)
    setViewState(true);
  }, [featuredCoupons])

  return (
    <>
      <View style={styles.space20}></View>
      <View style={styles.titlemain}>
        <Text style={[styles.title]}>Featured Coupons</Text>
      </View>
      {
        featuredCouponsData?.data?.length > 0 ? (<>
          <FlatList
            keyExtractor={item => item.product_id}
            data={featuredCouponsData.data}
            renderItem={item => (
              <CardsRenderItem item={item} />
            )}
            nestedScrollEnabled
          />
          {
            viewState && totalCount > 4 && featuredCouponsData?.data?.length != 8 ? <View>
              <TouchableOpacity
                style={styles.loadmain}
                onPress={() => [setLimitValue(totalCount), setViewState(false), ExploreHandler()]}
              >
                <Text style={styles.loadmaintext}>View All</Text>
              </TouchableOpacity>
            </View> : null

          }
        </>) : <Text
          style={{ textAlign: 'center', fontWeight: '800' }}>
          {' '}
          No Data Available..!!
        </Text>
      }
    </>
  )
}

export default FeaturedCouponsSection