import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    divider: {
      marginTop: 10,
    },
    input: {
      maxHeight: 120,
      justifyContent: 'center',
      borderRadius: 8,
      marginTop: 6,
      marginBottom: 8,
      marginHorizontal: 16,
      backgroundColor: 'white',
    },
  });
