import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    divider: { marginTop: 10 },
    input: {
      maxHeight: 120,
      justifyContent: 'center',
      borderRadius: 8,
      marginTop: 6,
      marginBottom: 8,
      marginHorizontal: 16,
      backgroundColor: theme.dark ? theme.colors.backdrop : 'white',
    },
    underline: { display: 'none' },
    stopButton: {
      bottom: 0,
      left: '20%',
      right: '20%',
      position: 'absolute',
      alignItems: 'center',
    },
  });
