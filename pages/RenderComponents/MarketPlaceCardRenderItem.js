import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from 'react-native';
import styles from '../../Common.css';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddcityId, setCityNameLocale } from '../../Utils/LocalStorage';

export const MarketPlaceCardRenderItem = ({ item, handleDefaultMarket }) => {
  const navigation = useNavigation();
  const handleExploreMarketPlace = (data) => {
    setCityNameLocale(data?.mms_city_name);
    AddcityId(data?.mms_city_id);
    navigation.navigate('Explore')
  }
  return (
    <>

      <TouchableOpacity onPress={() => handleExploreMarketPlace(item)}>
        <View style={item?.is_default ? styles.marketPlaceContainerDefault : styles.marketPlaceContainer}>
          <View>
            <Image
              source={item?.logo_image ? { uri: item?.logo_image } : require('../../assets/card.png')}
              style={styles.cardimg2}></Image>
          </View>
          <View>
            <Text style={styles.marketPlaceText}
              numberOfLines={5}
            >{item?.mms_city_name}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDefaultMarket(item)}>
            <View>
              <MaterialCommunityIcons
                name={
                  item.is_default ? "pin" : "pin-outline"}
                size={25}
                color="#E66100"
                style={styles.noteicon}
              />
            </View>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>

    </>

  )
}
