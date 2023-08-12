import { StyleSheet } from 'react-native';

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
      width: 4,
    },
    hint: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    exampleContainer: {
      padding: 12,
      borderRadius: 6,
      marginVertical: 8,
      marginHorizontal: 24,
      shadowRadius: 3,
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.dark ? 0.6 : 0,
      shadowOffset: { width: 0, height: 0 },
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.white,
    },
    example: {
      fontWeight: '500',
      textAlign: 'center',
      color: theme.dark ? theme.colors.white : theme.colors.black,
    },
  });
