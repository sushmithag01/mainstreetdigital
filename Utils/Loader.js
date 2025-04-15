import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Loader = (props) => {
  const { loading } = props
  const colorOrange = "#BE7542"
  const colorMaroon = "#AC5F5A"
  const colorBlue = "#92BCBF"
  const colorDarkBlue = "#223656"
  const colorGrey = "#495F754D"


  return (
    <View>
      {/* <ActivityIndicator size="large" color={colorBlue} /> */}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor='rgb(255, 255, 255)'
        color="#E66100"
      />
    </View>
  )
}


const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#E66100',
    fontSize: 18,
    fontFamily: 'Montserrat-medium',

  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Loader;