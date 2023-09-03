import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    flex1: { flex: 1 },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: loading => ({
      paddingTop: loading ? 50 : 10,
      paddingBottom: 10,
    }),
    loadingText: { marginTop: 20 },
    fab: {
      right: 24,
      bottom: 16,
      opacity: 0.4,
      borderRadius: 100,
      position: 'absolute',
      backgroundColor: theme.dark ? theme.colors.black : theme.colors.white,
    },
  });
