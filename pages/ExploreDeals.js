import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddcityId, setCityNameLocale } from '../Utils/LocalStorage';
import { TouchableHighlight } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const ExploreDeals = ({ setCityId, country_list, storedCityName }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [contryList, setCategoryList] = useState([]);
  const [City, setCity] = useState('');
  const [defaultCityName, setdefaultCityName] = useState('');


  // Fetch city_id and city_name from AsyncStorage
  useEffect(() => {

    if (isFocused) {
      setdefaultCityName(storedCityName)
      fetchCityData();
    }

  }, [isFocused, defaultCityName]); // Only runs on component mount

  const fetchCityData = async () => {
    const city_id = await AsyncStorage.getItem('city_id');
    const city_name = await AsyncStorage.getItem('user_city_name');
    setCity(city_id);
    setdefaultCityName(city_name)

  };

  // Set country list and default city
  useEffect(() => {
    setCategoryList(country_list);

    // Set default city if not already set
    if (!City && country_list?.length > 0) {
      const defaultCountry = {
        label: country_list[0][1],
        value: country_list[0][0],
      };
      selectedCountryfun(defaultCountry);
    }
  }, [country_list]); // Only runs when country_list changes

  const selectedCountryfun = item => {
    setCityNameLocale(item.label);
    AddcityId(item.value);
    setValue(item.value ? item.value : item[0][0]);
    setCityId(item.value);
  };

  return (
    <>
      <View>
        <Text style={styles.exploretext}>Explore Deals in</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('MarketPlaceLists')}>
        <View style={{ justifyContent: 'center', margin: 10, flexDirection: 'row' }}>
          <FontAwesome5
            style={styles.icon}
            color="#E66100"
            name="location-arrow"
            size={16}
          />
          <Text style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: 18, color: '#E66100',
            fontWeight: '700'
          }}>
            {storedCityName?.length > 50
              ? `${storedCityName.substring(0, 30)}...`
              : storedCityName}

          </Text>
          <View style={{ marginLeft: 6, alignItems: 'center', marginTop: 2 }}>
            <FontAwesome5 name="chevron-down" size={22} color="#E66100" />
          </View>
        </View>
      </TouchableOpacity>

      {/* <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={
          City
            ? City.replace(/['"]+/g, '')
            : data && data.length > 0
              ? data[0].label
              : 'Select Market Place'
        }
        searchPlaceholder="Search..."
        value={value}
        onChange={selectedCountryfun}
        renderLeftIcon={() => (
          <FontAwesome5
            style={styles.icon}
            color="#E66100"
            name="location-arrow"
            size={15}
          />
        )}
      /> */}

    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 30,
    borderBottomColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 10,
    marginTop: 5,
  },
  icon: {
    marginRight: 8,
    marginTop: 6,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#E66100',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  exploretext: {
    fontSize: 13,
    textAlign: 'center',
    color: '#000',
    marginTop: 0,
    fontFamily: 'Montserrat-Regular',
  },
});

export default ExploreDeals;