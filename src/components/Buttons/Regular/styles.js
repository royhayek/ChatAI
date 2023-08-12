import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: disabled => ({
      marginTop: 20,
      opacity: disabled ? 0.5 : 1,
    }),
    linearBackground: {
      padding: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: theme.colors.white,
      fontWeight: 'bold',
      paddingHorizontal: 3,
    },
    endIcon: {
      marginHorizontal: 8,
    },
  });
