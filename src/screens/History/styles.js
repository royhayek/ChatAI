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
    emptyImage: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    emptyText: { fontWeight: 'bold' },
  });
