import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    question: {
      marginVertical: 7,
      marginHorizontal: 14,
      backgroundColor: 'white',
      borderTopEndRadius: 20,
      borderBottomStartRadius: 20,
      borderBottomEndRadius: 20,
      padding: 15,
    },
    answer: {
      marginHorizontal: 14,
      backgroundColor: theme.colors.primary,
      borderTopStartRadius: 20,
      borderBottomStartRadius: 20,
      borderBottomEndRadius: 20,
      padding: 15,
      marginVertical: 7,
    },
  });
