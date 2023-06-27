import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      marginHorizontal: 16,
    },
    card: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.colors.background : 'white',
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.dark ? 0.6 : 0,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 0 },
    },
    title: {
      marginVertical: 16,
    },
    item: {
      marginVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    endIcon: {
      color: theme.dark ? 'white' : 'black',
      marginEnd: 15,
    },
    upgradeContainer: {
      padding: 20,
      borderRadius: 12,
      marginVertical: 20,
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    upgradeTitle: {
      color: 'white',
      fontWeight: 'bold',
    },
    upgradeDesc: {
      marginTop: 5,
      color: 'white',
    },
  });
