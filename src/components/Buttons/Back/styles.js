import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      borderWidth: 1.5,
      marginHorizontal: 8,
      borderColor: theme.dark ? 'white' : 'black',
    },
    title: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
