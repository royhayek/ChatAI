import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    container: {
      padding: ms(10),
      borderWidth: ms(1),
      borderRadius: ms(8),
      marginBottom: mvs(15),
      alignItems: 'center',
      flexDirection: 'row',
      borderColor: theme.colors.secondary,
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.background,
    },
    content: {
      flex: 1,
      marginStart: ms(12),
      marginEnd: ms(4),
    },
    title: {
      color: theme.dark ? theme.colors.white : theme.colors.black,
    },
    assistant: {
      marginVertical: mvs(3),
      color: theme.colors.primary,
    },
    date: {
      marginTop: mvs(2),
      color: theme.colors.secondary,
    },
  });
