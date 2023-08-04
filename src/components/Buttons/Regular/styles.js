import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      marginTop: 20,
    },
    linearBackground: {
      padding: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: 'white',
      fontWeight: 'bold',
      paddingHorizontal: 3,
    },
  });
