import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: loading => ({
      paddingTop: loading ? mvs(50) : 0,
    }),
    loadingText: { marginTop: mvs(20) },
    fab: {
      opacity: 0.4,
      right: ms(24),
      bottom: mvs(16),
      borderRadius: ms(100),
      position: 'absolute',
      backgroundColor: theme.dark ? theme.colors.black : theme.colors.white,
    },
  });
