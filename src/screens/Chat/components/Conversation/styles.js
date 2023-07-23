import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    question: {
      alignSelf: 'flex-end',
      marginVertical: 7,
      marginHorizontal: 14,
      backgroundColor: '#2C2C2C',
      borderTopStartRadius: 18,
      borderTopEndRadius: 18,
      borderBottomStartRadius: 18,
      borderBottomEndRadius: 2,
      padding: 15,
    },
    answer: {
      marginHorizontal: 14,
      backgroundColor: theme.colors.backdrop,
      borderTopStartRadius: 2,
      borderTopEndRadius: 18,
      borderBottomStartRadius: 18,
      borderBottomEndRadius: 18,
      marginVertical: 7,
      padding: 15,
    },
  });
