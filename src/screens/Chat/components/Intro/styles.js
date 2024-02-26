import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    row: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
    hSpacer: {
      width: ms(4),
    },
    hint: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    exampleContainer: {
      padding: ms(12),
      borderRadius: ms(6),
      marginVertical: mvs(8),
      marginHorizontal: ms(24),
      shadowRadius: 3,
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.dark ? 0.6 : 0,
      shadowOffset: { width: 0, height: 0 },
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.white,
    },
    example: {
      fontWeight: 500,
      textAlign: 'center',
      color: theme.dark ? theme.colors.white : theme.colors.black,
    },
  });
