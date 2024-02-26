import { ms } from 'react-native-size-matters';
import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      borderWidth: ms(1.5),
      borderRadius: ms(8),
      marginHorizontal: ms(8),
      borderColor: theme.dark ? theme.colors.white : theme.colors.black,
    },
    title: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
  });
