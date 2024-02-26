import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    divider: { marginTop: mvs(10) },
    input: {
      marginTop: mvs(6),
      maxHeight: mvs(80),
      borderRadius: ms(8),
      marginBottom: mvs(8),
      marginHorizontal: ms(16),
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.white,
    },
    underline: { display: 'none' },
    stopButton: {
      bottom: 10,
      left: '20%',
      right: '20%',
      position: 'absolute',
      alignItems: 'center',
    },
  });
