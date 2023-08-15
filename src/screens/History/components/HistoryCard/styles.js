import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      alignItems: 'center',
      flexDirection: 'row',
      borderColor: theme.colors.secondary,
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.background,
    },
    content: {
      flex: 1,
      marginStart: 12,
      marginEnd: 4,
    },
    title: {
      color: theme.dark ? theme.colors.white : theme.colors.black,
    },
    date: {
      marginTop: 5,
      color: theme.colors.secondary,
    },
  });
