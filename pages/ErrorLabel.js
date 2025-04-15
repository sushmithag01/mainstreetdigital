import React from 'react';
import {Text} from 'react-native';
import styles from '../Common.css';

const ErrorLabel = ({ErrorDisplay}) => {
  return <Text style={styles.Errlabel_font_size}>{ErrorDisplay}</Text>;
};

export default ErrorLabel;
