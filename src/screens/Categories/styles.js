import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
  });
