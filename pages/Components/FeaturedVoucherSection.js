import React, { useEffect, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View, Text, FlatList } from 'react-native';
import styles from "../../Common.css";
import CardsRenderItem from '../RenderComponents/CardsRenderItem';

function FeaturedVoucherSection({ featuredVoucher, setLimitValueFV, ExploreHandler }) {
  const [totalCount, setTotalCount] = useState(4);
  const [viewState, setViewState] = useState(true);
  const [featuredVoucherData, setfeaturedVoucherData] = useState([]);
  useEffect(() => {
    setTotalCount(featuredVoucher?.total_count)
    setfeaturedVoucherData(featuredVoucher);
    setViewState(true);
  }, [featuredVoucher])

  return (
    <>
      <View style={styles.space20}></View>
      <View style={styles.titlemain}>
        <Text style={[styles.title]}>Featured Vouchers</Text>
      </View>
      {
        featuredVoucherData?.data?.length > 0 ? (<>
          <FlatList
            keyExtractor={item => item.product_id}
            data={featuredVoucherData.data}
            renderItem={item => (
              <CardsRenderItem item={item} />
            )}
            nestedScrollEnabled
          />
          {
            viewState === true && totalCount > 4 && featuredVoucherData?.data?.length != 8 ? <View>
              <TouchableOpacity
                style={styles.loadmain}
                onPress={() => [setLimitValueFV(totalCount), setViewState(false), ExploreHandler()]}
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

export default FeaturedVoucherSection