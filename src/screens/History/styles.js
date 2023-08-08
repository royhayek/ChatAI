import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      padding: 16,
    },
    content: {
      flex: 1,
      marginStart: 12,
    },
    date: {
      marginTop: 5,
      color: theme.colors.secondary,
    },
    modalTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginVertical: 10,
      marginHorizontal: 20,
    },
    modalButtons: {
      gap: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
