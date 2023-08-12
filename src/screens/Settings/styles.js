import { isRTL } from '../../config/i18n';
import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      marginHorizontal: 16,
    },
    contentContainer: { paddingBottom: 30 },
    iconAndTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageMenuContent: {
      shadowOpacity: 0.2,
      backgroundColor: theme.colors.background,
    },
    anchor: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.dark ? theme.colors.background : theme.colors.white,
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.dark ? 0.6 : 0,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 0 },
    },
    title: {
      marginVertical: 16,
    },
    item: {
      marginVertical: 9,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    endIcon: {
      color: theme.dark ? theme.colors.white : theme.colors.black,
      marginEnd: 15,
    },
    arrowIcon: {
      marginStart: 3,
      transform: isRTL ? [{ rotateY: '180deg' }] : [],
    },
    upgradeContainer: {
      padding: 20,
      borderRadius: 12,
      marginVertical: 5,
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    upgradeTitle: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    upgradeDesc: {
      marginTop: 5,
      color: theme.colors.white,
    },
    modalContainer: {
      margin: 24,
      shadowOpacity: 0,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalHeaderTitle: {
      fontWeight: 'bold',
    },
    modalContent: {
      padding: 16,
    },
    planTitle: {
      color: theme.colors.secondary,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    upgradeBtn: {
      height: 46,
      justifyContent: 'center',
      borderRadius: 8,
    },
  });
