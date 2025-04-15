import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../Common.css';
import LatestLocalCard from '../LatestLocalCard';
import CardsRenderItem from '../RenderComponents/CardsRenderItem';
import { FlatList } from 'react-native';

const LatestLocals = ({
  exploreList,
  setLimitValue,
  ExploreHandler
}) => {

  const [totalCount, setTotalCount] = useState(4);
  const [viewState, setViewState] = useState(true);
  const [exploreListData, setexploreListData] = useState([]);
  useEffect(() => {
    setTotalCount(exploreList?.total_count)
    setexploreListData(exploreList)
    setViewState(true);
  }, [exploreList])


  return (
    <>
      <View style={styles.space20}></View>
      <View style={styles.titlemain}>
        <Text style={[styles.title]}>Latest Deals</Text>
      </View>
      {
        exploreListData?.data?.length > 0 ? (<>
          <FlatList
            keyExtractor={item => item.product_id}
            data={exploreListData.data}
            renderItem={item => (
              <CardsRenderItem item={item} />
            )}
            nestedScrollEnabled
          />
          {
            viewState && totalCount > 4 && exploreListData?.data?.length < totalCount ? <View>
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
  );
};
export default LatestLocals;
