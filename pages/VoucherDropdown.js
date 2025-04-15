import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const data = [
  {label: 'All', value: '0'},
  {label: 'Available Vouchers', value: '1'},
  {label: 'Redeemed Vouchers', value: '2'},
  {label: 'Expired Vouchers', value: '3'},
];

const VoucherDropdown = ({selectedFilterVal}) => {
  const [value, setValue] = useState(data[0].value);

  const ValueHandler = item => {
    setValue(item);
    selectedFilterVal(item);
  };
  return (
    <>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={data.find(item => item.value === value)?.label}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          ValueHandler(item.value);
        }}
        // renderLeftIcon={() => (
        //   <FontAwesome5 style={styles.icon} color="#E66100" name="location-arrow" size={15} />
        // )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 5,
    marginTop: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginTop: 10,
    fontFamily: 'Montserrat-Bold',
  },
});

export default VoucherDropdown;
