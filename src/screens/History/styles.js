import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

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
      padding: ms(16),
    },
    modalTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginVertical: mvs(10),
      marginHorizontal: ms(20),
    },
    modalButtons: {
      gap: ms(20),
      flexDirection: 'row',
      justifyContent: 'center',
    },
    emptyImage: {
      width: ms(100),
      height: mvs(100),
      marginBottom: mvs(20),
    },
    emptyText: { fontWeight: 'bold' },
  });
