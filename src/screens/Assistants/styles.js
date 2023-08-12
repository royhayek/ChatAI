import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: 30,
    },
    icon: {
      width: 70,
      height: 70,
      marginEnd: 16,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.primaryLight,
    },
    name: { marginBottom: 5 },
    flatList: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    question: {
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    divider: { marginBottom: 10 },
  });
