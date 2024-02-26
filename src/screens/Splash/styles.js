import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.background : theme.colors.white,
    },
    lottie: {
      width: ms(130),
      height: mvs(130),
    },
  });
