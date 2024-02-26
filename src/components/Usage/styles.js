import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

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
      marginVertical: mvs(40),
      alignItems: 'center',
    },
    closeButton: { position: 'absolute' },
    freeMessagesTextBg: {
      width: '90%',
      padding: ms(15),
      marginTop: mvs(20),
      borderRadius: ms(10),
      alignItems: 'center',
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.lightGray,
    },
    availableMsgs: { textAlign: 'center' },
    upgradeButton: {
      width: '90%',
    },
    earnButton: {
      width: '90%',
      marginTop: mvs(15),
    },
    playLottie: {
      marginRight: ms(8),
      height: mvs(25),
      transform: [{ scale: 1.1 }],
    },
  });
