import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    container: disabled => ({
      marginTop: mvs(20),
      opacity: disabled ? 0.5 : 1,
    }),
    linearBackground: {
      padding: ms(12),
      borderRadius: ms(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: theme.colors.white,
      fontWeight: 'bold',
      paddingHorizontal: ms(3),
    },
    endIcon: {
      marginHorizontal: ms(8),
    },
  });
