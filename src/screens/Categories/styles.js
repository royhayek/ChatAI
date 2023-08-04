import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    icon: {
      width: 70,
      height: 70,
      marginEnd: 16,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.primaryLight,
    },
    name: {
      marginBottom: 5,
    },
  });
