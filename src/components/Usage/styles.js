import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    bottomSheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomSheetTitle: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    bottomSheetContent: {
      marginVertical: 40,
      alignItems: 'center',
    },
    freeMessagesTextBg: {
      width: '90%',
      padding: 15,
      marginTop: 20,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.lightGray,
    },
    upgradeButton: {
      width: '90%',
    },
    earnButton: {
      width: '90%',
      marginTop: 15,
    },
  });
