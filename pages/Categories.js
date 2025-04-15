import React, { useState, useEffect } from 'react';
import { BottomSheet } from '@rneui/themed';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { CheckBox } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Common.css';
import { useNavigation } from '@react-navigation/native';


const Categories = ({ categorylist, selectedcategory, loading, selectedCategory }) => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [checked, setChecked] = useState({ state: true, id: 0 });
  const [categoryList, setCategoryList] = useState([]);
  const [tagFlag, selectTagFlag] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  useEffect(() => {
    setCategoryList(categorylist);
    setSelectedCategoryId(selectedCategory);
    setChecked({ state:true, id: selectedCategory});
  }, [categorylist, selectedCategory]);
  const toggleCheckbox = event => {
    if (event.state === true) {
      setSelectedCategoryId(event.id);
    } else {
      setSelectedCategoryId(0);
    }
    setChecked({ state: event.state, id: event.id });
  };

  const handleCategoryApply = () => {
    selectedcategory(selectedCategoryId);
  };

  const renderCategoryCheckboxItem = ({ item }) => {
    return (
      <>
        <View style={styles.selectmain}>
          <CheckBox
            checked={
              checked.id === item.category_id && checked.state === true
                ? true
                : false
            }
            onPress={() => toggleCheckbox({ state: true, id: item.category_id })}
            iconType="material-community"
            checkedIcon="radiobox-marked"
            uncheckedIcon={'radiobox-blank'}
            title={item.category_name}
            containerStyle={styles.checkmain}
            checkedColor="#E66100"
          />
          {/* <Text>4</Text> */}
        </View>
        {/* } */}
      </>
    );
  };
  return (
    <>
      <View style={styles.containerr1}>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={styles.sortdrop}>
          <Ionicons
            style={styles.icon}
            color={isFocus ? '#e66100' : '#e66100'}
            name="list-outline"
            size={22}
          />
        </TouchableOpacity>
      </View>
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
              Categories
            </Text>
          </View>
          <View style={styles.checksection}>
            <ScrollView>
              <SafeAreaView horizontal={true} style={{ flex: 1 }}>
                <ScrollView>
                  <CheckBox
                    checked={
                      checked.id === 0 && checked.state === true ? true : false
                    }
                    onPress={() => toggleCheckbox({ state: true, id: 0 })}
                    iconType="material-community"
                    checkedIcon="radiobox-marked"
                    uncheckedIcon={'radiobox-blank'}
                    title="All"
                    containerStyle={styles.checkmain}
                    checkedColor="#E66100"
                  />
                  {/* } */}
                  <FlatList
                    data={categoryList}
                    renderItem={renderCategoryCheckboxItem}
                    keyExtractor={item => item.category_id}
                  />
                </ScrollView>
              </SafeAreaView>
            </ScrollView>
          </View>
          <View style={styles.checkbtnmain}>
            <TouchableOpacity
              style={styles.closebtn}
              onPress={() => setIsVisible(false)}>
              <Text style={styles.closebtntext}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applybtn}
              onPress={() => [setIsVisible(false), selectedcategory(selectedCategoryId)]}>
              <Text style={styles.applytext}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};
export default Categories;
