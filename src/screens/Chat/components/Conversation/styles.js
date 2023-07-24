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
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.lightGray,
      borderTopStartRadius: 2,
      borderTopEndRadius: 18,
      borderBottomStartRadius: 18,
      borderBottomEndRadius: 18,
      marginVertical: 7,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
  });

export const markdownStyles = theme => ({
  text: {
    ...theme.fonts.labelLarge,
    color: theme.dark ? 'white' : 'black',
    lineHeight: 23,
  },
  blockquote: {
    ...theme.fonts.labelLarge,
    color: theme.dark ? 'white' : 'black',
  },
  em: {
    ...theme.fonts.bodySmall,
    color: theme.dark ? 'white' : 'black',
    fontWeight: '500',
    fontSize: 12.8,
    lineHeight: 19,
  },
  codespan: {
    ...theme.fonts.labelLarge,
    color: theme.dark ? 'white' : 'black',
    fontWeight: 'bold',
    backgroundColor: theme.dark ? theme.colors.secondaryContainer : 'transparent',
  },
  link: {
    ...theme.fonts.labelLarge,
  },
  code: {
    ...theme.fonts.labelLarge,
    flex: 1,
    backgroundColor: theme.dark ? theme.colors.background : theme.colors.white,
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'white',
  },
  li: {
    ...theme.fonts.labelLarge,
    color: theme.colors.secondary,
    flex: 1,
    fontWeight: 'bold',
  },
});
