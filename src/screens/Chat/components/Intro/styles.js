import React from 'react';
import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    content: {
      flex: 1,
      marginVertical: 30,
      alignItems: 'center',
    },
    title: {
      fontWeight: 'bold',
    },
    row: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
    hSpacer: {
      width: 4,
    },
    exampleContainer: {
      padding: 8,
      borderRadius: 6,
      marginVertical: 8,
      marginHorizontal: 14,
      backgroundColor: theme.dark ? theme.colors.background : 'white',
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.dark ? 0.6 : 0,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 0 },
    },
    example: {
      textAlign: 'center',
    },
  });
