import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: mvs(30),
      paddingHorizontal: ms(16),
    },
    icon: {
      width: ms(70),
      height: mvs(70),
      marginEnd: ms(16),
      borderRadius: ms(50),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.primaryLight,
    },
    name: { marginBottom: mvs(5) },
    flatList: {
      marginTop: mvs(16),
    },
    question: {
      marginBottom: mvs(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    divider: { marginBottom: mvs(10) },
  });
