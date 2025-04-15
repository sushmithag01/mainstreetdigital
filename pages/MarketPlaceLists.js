import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import Search from './SearchBar';
import { MarketPlaceCardRenderItem } from './RenderComponents/MarketPlaceCardRenderItem';
import { CountryListApi } from '../Utils/Api/CountryListApi';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Common.css';
import { MakeDefaultMarketPlaceApi } from '../Utils/Api/SetMarketPlaceDefault';
import { AddcityId, setCityNameLocale } from '../Utils/LocalStorage';
import Toast from 'react-native-root-toast';
import Loader from '../Utils/Loader';

const MarketPlaceLists = () => {
    const isFocused = useIsFocused();
    const [search, setSearchValue] = useState('');
    const [limit, setLimit] = useState(9);
    const [offset, setOffset] = useState(0);
    const [userId, setUserId] = useState('');
    const [marketPlaceData, setMarketPlaceData] = useState([]);
    const [total_count, setTotalCount] = useState(0);
    const [defaultcityId, setDefaultCityId] = useState(0)
    const [loading, setLoading] = useState(false);

    const searchHandler = e => {
        setSearchValue(e);
    };

    useEffect(() => {
        if (isFocused) {
            marketPlaceHandler();
        }
    }, [isFocused, search, limit, offset])

    // useEffect(()=>{
    //     handleDefault();
    // },[defaultcityId])

    const handleDefaultMarket = async (data) => {
        payload = {
            user_id: await AsyncStorage.getItem('userId'),
            city_id: data?.mms_city_id
        }
        // setCityNameLocale(data?.mms_city_name);
        // AddcityId(data?.mms_city_id);
        const updateDefault = await MakeDefaultMarketPlaceApi(payload)
        if (updateDefault.status === 200) {
            Toast.show(updateDefault.message, {
                duration: 6000,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000000',
                // backgroundColor: '#000',
                // textColor: '#17fc03',
                textStyle: {
                    fontSize: 18,
                    fontWeight: "500" // Increase the font size here
                },
            });
            marketPlaceHandler();
        } else {
            Toast.show(updateDefault.message, {
                duration: 6000,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: '#fff',
                textColor: '#000000',
                textStyle: {
                    fontSize: 18,
                    fontWeight: "500" // Increase the font size here
                },
            });
        }
    }


    const marketPlaceHandler = async () => {
        setLoading(true)
        payload = {
            limit: limit,
            offset: offset,
            search_value: search,
            user_id: await AsyncStorage.getItem('userId')
        }
        const listData = await CountryListApi(payload);
        if (listData.res.status === 200) {
            setMarketPlaceData(listData.res.data);
            setTotalCount(listData.res.total_count)
        } else {
            setMarketPlaceData([]);
            setTotalCount(0);
        }
        setLoading(false)
    }
    return (
        <>
            {loading ? <Loader loading={loading} /> : null}
            <View style={{ margin: 20 }}>
                <Search setSearchValue={setSearchValue} searchval={search} />
            </View>
            <View style={{ margin: 10 }}>
                <Text style={styles.marketplaceText1}>Marketplace Lists</Text>
                <Text style={styles.marketplaceText2}>
                    Choose a marketplace to  <Text style={styles.bold}>Explore</Text> deals specific to that.
                </Text>
                <Text style={styles.marketplaceText2} >Use the <Text style={styles.bold}>pin icon </Text>to update your favorite marketplace.</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    marketPlaceData.length > 0 ?
                        <View style={{ marginTop: 20 }}>
                            <FlatList
                                keyExtractor={item => item.mms_city_id}
                                data={marketPlaceData}
                                renderItem={(item) => (<MarketPlaceCardRenderItem item={item.item} handleDefaultMarket={handleDefaultMarket} />)}
                                nestedScrollEnabled
                            />
                        </View> : <Text
                            style={{ textAlign: 'center', fontWeight: '800', marginTop: 200, fontFamily: 'Montserrat-Medium' }}>
                            {' '}
                            No Data Available..!!
                        </Text>
                }

                <View style={{ marginTop: 20 }}>
                    {
                        total_count > 9 && total_count < limit ?
                            <TouchableOpacity
                                style={[styles.loadmain, { marginBottom: 10 }]}
                                onPress={() => setLimit(limit + 9)}
                            >
                                <Text style={styles.loadmaintext}>Load More</Text>
                            </TouchableOpacity> : null
                    }
                </View>

            </ScrollView>
        </>


    )
}

export default MarketPlaceLists