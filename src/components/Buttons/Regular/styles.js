import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      height: 46,
      marginTop: 20,
      borderRadius: 8,
      justifyContent: 'center',
    },
    title: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
