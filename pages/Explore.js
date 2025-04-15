import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Search from './SearchBar';
import Sort from './Sort';
import ExploreSlider from './ExploreSlider';
import Categories from './Categories';
import LatestLocals from './Components/LatestLocals';
import PopularDeals from './PopularDeals';
import ExploreDeals from './ExploreDeals';
import { CountryListApi } from '../Utils/Api/CountryListApi';
import { ExploreApi } from '../Utils/Api/ExploreApi';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../Utils/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon, Tab, TabView, ButtonGroup } from '@rneui/themed';
import Svg, { Path } from 'react-native-svg';
import { SessionTimeOut } from '../Utils/ErrorMessage';
import Toast from 'react-native-root-toast';
import FeaturedCouponsSection from './Components/FeaturedCouponsSection';
import FeaturedVoucherSection from './Components/FeaturedVoucherSection';
import { ExploreCustomNavigator } from '../navigation/CustomBackNavigator';

let city;
let apple_email;

const Explore = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [categoryList, setCategoryList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [popularDealsList, setPopularDealsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedcountry, setSelectedCountry] = useState(1);
  const [exploreList, setExploreList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState(0);
  const [bannerImages, setBannerImage] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [networkInfo, setNetworkInfo] = useState(false);
  const [profileImg, setUserProfile] = useState('');
  const [bannerLoading, setBannerLoading] = useState(false);
  const [categoryLoading, setcategoryLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [popularDealsLoading, setPopularDealsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const defaultImg =
    'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [featuredCoupons, setFeaturedCoupon] = useState([]);
  const [featuredVoucher, setFeaturedVoucher] = useState([]);
  const [limitValueFV, setLimitValueFV] = useState(4);
  const [limitValueFC, setLimitValueFC] = useState(4);
  const [limitValueLD, setLimitValueLD] = useState(4);
  const [flagValue, setFlagValue] = useState(0);
  const [fvActiveTab, setFeaturedVoucherActive] = useState(false);
  const [fcActiveTab, setFeaturedCouponActive] = useState(false);
  const [storedCityName, setstoredCityName] = useState('');


  async function getcityid() {
    city = await AsyncStorage.getItem('city_id');
    apple_email = await AsyncStorage.getItem('apple_email');
    const city_name = await AsyncStorage.getItem('user_city_name');
    setstoredCityName(city_name);
    setCityId(city);

  }
  useEffect(() => {
    if (isFocused) {
      getcityid({}).then(() => {
        setCityId(city);
        ExploreHandler();
      });
    }
  }, [isFocused, cityId]);

  useEffect(() => {
    setLoading(true)
    setFeaturedVoucherActive(false);
    setFeaturedCouponActive(false)
    setSelectedIndex(0);
    setSearchValue('')
    setSelectedCategory(0);
    setFlagValue(0);
    setSortValue(0);
    setLimitValueFC(4);
    setLimitValueFV(4);
    setLimitValueLD(4);
    setLoading(false)
  }, [cityId])

  useEffect(() => {
    ExploreHandler();
  }, [selectedCategory, search, sortValue, selectedcountry, limitValueFC, limitValueFV, limitValueLD])


  useEffect(() => {
    navigation.setOptions({
      header: props => (
        <ExploreCustomNavigator navigation={navigation} profileImg={profileImg} defaultImg={defaultImg} />
      ),
    });
  }, [profileImg]);

  const ExploreHandler = async () => {
    setLoading(true)
    setBannerImage([]);
    setCategoryList([]);
    setExploreList([]);
    setPopularDealsList([]);
    setUserProfile('');
    setFeaturedCoupon([]);
    setFeaturedVoucher([]);
    const city_name = await AsyncStorage.getItem('user_city_name');
    setstoredCityName(city_name);
    const explore_data = {
      user_id: await AsyncStorage.getItem('userId'),
      category_id: selectedCategory,
      city_id: cityId ? parseInt(cityId) : await AsyncStorage.getItem('city_id'),
      search_value: search,
      sort: parseInt(sortValue),
      limit: flagValue === 0 ? limitValueFV : flagValue === 1 ? limitValueFC : limitValueLD,
      flag: flagValue,
    };

    const exploreData = await ExploreApi(explore_data);
    if (exploreData.status === 200) {
      try {
        setBannerImage(exploreData.data.banner_image);
        setCategoryList(exploreData.data.category_list);
        setExploreList(exploreData.data.explore_latest);
        setPopularDealsList(exploreData.data.popular_deal);
        setUserProfile(exploreData.data.profile_image);
        setFeaturedCoupon(exploreData.data.featured_coupons);
        setFeaturedVoucher(exploreData.data.featured_vouchers);
        setFeaturedCouponActive(exploreData.data.featured_coupons.active_tab);
        setFeaturedVoucherActive(exploreData.data.featured_vouchers.active_tab);
        if (!exploreData?.data?.featured_coupons?.active_tab && !exploreData?.data?.featured_vouchers?.active_tab && exploreData?.data?.explore_latest?.data?.length > 0) {
          setFlagValue(2)
        }
        setLoading(false);
      } catch (error) {
        setBannerImage([]);
        setCategoryList([]);
        setExploreList([]);
        setPopularDealsList([]);
        setFeaturedCoupon([]);
        setFeaturedVoucher([]);
        setUserProfile('');
        console.log('err', error);
        setLoading(false);
      }
    } else {
      if (exploreData.status === 429) {
        setBannerImage([]);
        setCategoryList([]);
        setExploreList([]);
        setPopularDealsList([]);
        setFeaturedCoupon([]);
        setFeaturedVoucher([]);
        setUserProfile('');
        setLoading(true);
        Toast.show(exploreData.message, {
          duration: 6000,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
          opacity: 1,
          textStyle: {
            fontSize: 18,
            fontWeight: '500', // Increase the font size here
          },
        });
      } else if (
        exploreData.message === 'Token is invalid!' ||
        exploreData.message === 'Request failed with status code 403'
      ) {
        setBannerImage([]);
        setCategoryList([]);
        setExploreList([]);
        setPopularDealsList([]);
        setUserProfile('');
        setFeaturedCoupon([]);
        setFeaturedVoucher([]);
        AsyncStorage.clear();
        navigation.navigate('SignIn');
        Toast.show(SessionTimeOut, {
          duration: 6000,
          position: 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#fff',
          textColor: '#000000',
          opacity: 1,
          textStyle: {
            fontSize: 18,
            fontWeight: '500', // Increase the font size here
          },
        });
      }
    }
    setLoading(false);
  };

  function selectedcategoryHandle(data) {
    setSelectedCategory(data);
    if (fcActiveTab && fvActiveTab) {
      setSelectedIndex(2)
      setFlagValue(2)
    } else {
      setSelectedIndex(1)
      setFlagValue(2)
    }

  }
  const searchHandler = e => {
    setSearchValue(e);

  };
  const sortHandler = e => {
    setSortValue(e);
  };

  const handleTabChange = (value) => {
    //[ featured vouchers = 0,featured coupons = 1, latest deals = 2] setting flag value
    setSelectedCategory(0);
    setSearchValue('')
    setSelectedIndex(value)
    setSortValue(0);
    const isExploreListValid = exploreList?.data?.length > 0;
    const isFeaturedCouponsValid = fcActiveTab;
    const isFeaturedVoucherValid = fvActiveTab;
    // Determine flag based on conditions
    if (isExploreListValid && isFeaturedCouponsValid && isFeaturedVoucherValid) {
      setFlagValue(value);
    } else if (isExploreListValid && isFeaturedCouponsValid) {
      setFlagValue(value + 1);
    } else if (
      isExploreListValid &&
      isFeaturedVoucherValid &&
      value === 0
    ) {
      setFlagValue(value);
    } else if (
      isExploreListValid &&
      isFeaturedVoucherValid &&
      value === 1
    ) {
      setFlagValue(value + 1);
    } else if (isExploreListValid) {
      setFlagValue(value + 2);
    }

  }
  return (
    <>
      {loading ? <Loader loading={loading} /> : null}
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <ExploreDeals setCityId={setCityId} country_list={countryList} storedCityName={storedCityName} />
          {bannerLoading ? (
            <ActivityIndicator />
          ) : bannerImages && bannerImages.length > 0 ? (
            <ExploreSlider bannerImage={bannerImages} />
          ) : null}
          <View style={styles.serachmain}>
            <View style={styles.searchleft}>
              <Search setSearchValue={setSearchValue} searchval={search} />
            </View>
            <View style={styles.searchright}>
              <Sort sortHandler={sortHandler} sortValue={sortValue} />
            </View>
            <View style={styles.searchright}>
              <Categories
                categorylist={categoryList}
                selectedcategory={selectedcategoryHandle}
                loading={categoryLoading}
                selectedCategory={selectedCategory}
              />
            </View>
          </View>

          <View>
            {!fvActiveTab && !fcActiveTab ? null
              : (<View style={{ backgroundColor: '#fff', marginTop: 40, padding: 0, height: 58 }}>
                {
                  fvActiveTab && fcActiveTab ?
                    <ButtonGroup
                      buttons={['Featured Vouchers', 'Featured Coupons', 'Latest Deals']}
                      selectedIndex={selectedIndex}
                      onPress={value => {
                        handleTabChange(value);
                      }}
                      containerStyle={styles.btncontainer}
                      selectedButtonStyle={styles.selectedbtn}
                      buttonContainerStyle={styles.buttonContainerStyle}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.textStyle}
                    />
                    : fvActiveTab && !fcActiveTab ?
                      <ButtonGroup
                        buttons={['Featured Vouchers', 'Latest Deals']}
                        selectedIndex={selectedIndex}
                        onPress={value => {
                          handleTabChange(value);
                        }}
                        containerStyle={styles.btncontainer}
                        selectedButtonStyle={styles.selectedbtn}
                        buttonContainerStyle={styles.buttonContainerStyle}
                        buttonStyle={styles.buttonStyle}
                        textStyle={styles.textStyle}
                      />
                      : !fvActiveTab && fcActiveTab ?
                        <ButtonGroup
                          buttons={['Featured Coupons', 'Latest Deals']}
                          selectedIndex={selectedIndex}
                          onPress={value => {
                            handleTabChange(value);
                          }}
                          containerStyle={styles.btncontainer}
                          selectedButtonStyle={styles.selectedbtn}
                          buttonContainerStyle={styles.buttonContainerStyle}
                          buttonStyle={styles.buttonStyle}
                          textStyle={styles.textStyle}
                        />
                        : null
                }

              </View>)}
            {
              fvActiveTab && selectedIndex === 0 ? (
                <View>
                  <FeaturedVoucherSection featuredVoucher={featuredVoucher} setLimitValueFV={setLimitValueFV} ExploreHandler={ExploreHandler} />
                </View>
              ) : fvActiveTab && fcActiveTab && selectedIndex === 1 ? (
                <View>
                  <FeaturedCouponsSection featuredCoupons={featuredCoupons} setLimitValue={setLimitValueFC} ExploreHandler={ExploreHandler} />
                </View>
              ) : fcActiveTab && !fvActiveTab && selectedIndex === 0 ? <View>
                <FeaturedCouponsSection featuredCoupons={featuredCoupons} setLimitValue={setLimitValueFC} ExploreHandler={ExploreHandler} />
              </View> : (
                <View>
                  <LatestLocals
                    exploreList={exploreList}
                    setLimitValue={setLimitValueLD}
                    ExploreHandler={ExploreHandler}
                  />
                </View>
              )
            }
          </View>
          <PopularDeals
            popularDealsList={popularDealsList}
            loading={popularDealsLoading}
          />
          <View style={styles.space50}></View>
        </SafeAreaView>
      </ScrollView >
    </>
  );
};
const styles = StyleSheet.create({
  main: {
    marginHorizontal: 10,
  },
  serachmain: {
    // flex:2,
    flexDirection: 'row',
    marginTop: 10,
    // overflow: 'visible'
  },
  searchleft: {
    width: '100%',
    flex: 1,
    // overflow: 'visible',
    height: 50,
  },
  searchright: {
    width: 60,
  },
  headerhome: {
    // height: 110,
    // paddingTop:50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        paddingTop: 50,
        height: 110,
      },
      android: {
        paddingTop: 10,
        height: 80,
      },
    }),
  },
  headerright: {
    flexDirection: 'row',
    marginTop: 10,
  },
  notify: {
    marginRight: 25,
    marginTop: 6,
  },
  profile: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 23,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 40,
    height: 40,
  },
  selectedbtn: {
    backgroundColor: '#E66100',
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 0,
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
  },
  btncontainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 0,
    fontSize: 20,
    height: 50,
    marginHorizontal: 0
  },
  buttonContainerStyle: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
    borderWidth: 0,
    borderRightWidth: 0,
    fontSize: 20,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    // borderRadius: 10,
    borderWidth: 0,
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    padding: 5,
  },
  textStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  tabTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#E66100',
    fontWeight: '800'
  },
  ActivetabTextStyle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#FFF',
    fontWeight: '800',
    backgroundColor: '#E66100',
    width: 150,
    borderRadius: 80,
    margin: 0,
    height: 58,
  }
});
export default Explore;