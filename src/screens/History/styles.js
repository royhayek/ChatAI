import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    text: {
      flex: 1,
      marginLeft: 8,
    },
  });
