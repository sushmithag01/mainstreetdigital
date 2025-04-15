import React, { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, StyleSheet, Keyboard, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Search = ({ setSearchValue, searchval }) => {
  const [search, setSearch] = useState(searchval);

  // useEffect(() => {
  //   searchHandler(search)
  // }, [search]);

  const handleClearPress = () => {
    setSearchValue('');
    setSearch(''); // Clear the search text
    // console.log('Clear icon pressed!'); // Add any additional logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="Search"
          onChangeText={setSearch}
          value={search}
          inputContainerStyle={styles.searchbarinner}
          containerStyle={styles.searchbarmain}
          searchIcon={null}
          placeholderTextColor="#E66100"
          inputStyle={styles.searchinput}
          clearIcon={search ?
            <TouchableOpacity onPress={handleClearPress}>
              <MaterialCommunityIcons name="close" size={24} color="#E66100" />
            </TouchableOpacity> : null
          }
        />
        <TouchableOpacity style={styles.button} onPress={(e) => setSearchValue(search)}>
          <MaterialCommunityIcons
            name="magnify" // Custom icon name
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbarinner: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 0,
    color: '#E66100',
  },
  searchbarmain: {
    flex: 1, // Allow SearchBar to take remaining space
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
  },
  searchinput: {
    color: '#000',
  },
  button: {
    backgroundColor: '#E66100',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
  },
});

export default Search;
