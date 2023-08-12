import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      borderWidth: 1.5,
      marginHorizontal: 8,
      borderColor: theme.dark ? theme.colors.white : theme.colors.black,
    },
    title: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
  });
