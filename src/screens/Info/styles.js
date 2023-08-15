import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      direction: 'ltr',
      backgroundColor: theme.colors.background,
    },
  });
