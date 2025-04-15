import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomSheet } from '@rneui/themed';
import styles from '../Common.css';

const data = [
  { label: 'Latest', value: '0' },
  { label: 'Price: Low to High', value: '1' },
  { label: 'Price: High to Low', value: '2' },
];

const Sort = ({ sortValue, sortHandler }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cust_style, setStyle] = useState(false);


  useEffect(() => {
    handleSort(sortValue);
  }, [sortValue])
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const handleSort = data => {
    // sortHandler(data);
    setStyle({ id: data, state: true });
  };

  return (
    <View style={styles.containerr}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.sortdrop}>
        <Ionicons
          style={styles.icon}
          color={isFocus ? '#e66100' : '#e66100'}
          name="swap-vertical-sharp"
          size={20}
        />
      </TouchableOpacity>

      <BottomSheet modalProps={{}} isVisible={isVisible}>
        <View style={styles.bottomsheetmain}>
          <View style={[styles.titlemain, styles.bottomsheetheader]}>
            <Text
              style={[styles.title, styles.orangetitle]}
              onPress={() => setIsVisible(false)}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons
                  color="#E66100"
                  name="chevron-back"
                  style={styles.backorg}
                  size={25}
                />
              </TouchableOpacity>
              Sort
            </Text>
            {/* <TouchableOpacity onPress={() => toggleCheckbox({ state: false, id: 0 })}><Text style={[styles.seealltext, styles.clearall]}>Clear All</Text></TouchableOpacity> */}
          </View>
          <View style={styles.checksection1}>
            <SafeAreaView horizontal={true}>
              <ScrollView>
                <TouchableOpacity onPress={() => handleSort(0)}>
                  <Text
                    style={[
                      styles.sorttext,
                      {
                        fontWeight:
                          cust_style.id === 0 && cust_style.state === true
                            ? '700'
                            : null,
                      },
                    ]}>
                    Latest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort(1)}>
                  <Text
                    style={[
                      styles.sorttext,
                      {
                        fontWeight:
                          cust_style.id === 1 && cust_style.state === true
                            ? '700'
                            : null,
                      },
                    ]}>
                    Price: Low to High
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort(2)}>
                  <Text
                    style={[
                      styles.sorttext,
                      {
                        fontWeight:
                          cust_style.id === 2 && cust_style.state === true
                            ? '700'
                            : null,
                      },
                    ]}>
                    Price: High to Low
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </View>
          <View style={styles.checkbtnmain}>
            <TouchableOpacity
              style={styles.closebtn}
              onPress={() => setIsVisible(false)}>
              <Text style={styles.closebtntext}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applybtn}
              onPress={() => [setIsVisible(false), sortHandler(cust_style.id)]}>
              <Text style={styles.applytext}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      {/* {renderLabel()} */}
      {/* <Dropdown
        //   style={[styles.dropdownn, isFocus && { borderColor: 'blue' }]}
        //   placeholderStyle={styles.placeholderStylee}
        //   selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStylee}
          data={data}
        //   search
          maxHeight={300}
          labelField="label"
          valueField="value"
         placeholder={<Ionicons
          style={styles.icon}
          color={isFocus ? '#E66100' : '#E66100'}
          name="swap-vertical-sharp"
          size={20}
        />}
        // searchPlaceholder="Search..."
         value={value}
        //   onFocus={() => setIsFocus(true)}
        //   onBlur={() => setIsFocus(false)}
          // placeholder={false}
          onChange={item => {
            sortValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <Ionicons
              style={styles.icon}
              color={isFocus ? '#fff' : '#fff'}
              name="swap-vertical-sharp"
              size={20}
            />
          )}
        /> */}
    </View>
  );
};

export default Sort;
