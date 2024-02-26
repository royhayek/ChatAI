import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollViewContent: {
      padding: ms(16),
    },
    title: {
      marginTop: mvs(5),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    benefitsContainer: {
      gap: ms(20),
      marginTop: mvs(20),
      borderRadius: ms(18),
      marginHorizontal: ms(8),
      paddingVertical: mvs(24),
      paddingHorizontal: ms(16),
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.white,
    },
    benefitContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    benefitTexts: {
      marginStart: ms(15),
    },
    benefitTitle: {
      fontWeight: 'bold',
    },
    benefitDesc: {
      color: theme.colors.secondary,
    },
    benefitIcon: {
      color: theme.dark ? theme.colors.white : theme.colors.white,
    },
    plansContainer: {
      gap: ms(8),
      marginTop: mvs(20),
      marginBottom: mvs(10),
    },
    planContainer: (isSelected, isOwned) => ({
      marginBottom: mvs(4),
      borderWidth: ms(1.5),
      borderRadius: ms(18),
      paddingVertical: mvs(10),
      paddingHorizontal: ms(20),
      backgroundColor: isSelected || isOwned ? theme.colors.primaryLight : 'transparent',
      borderColor: isSelected ? theme.colors.primary : isOwned ? theme.colors.secondary : theme.colors.backdrop,
    }),
    planTitle: {
      marginBottom: mvs(3),
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.secondary,
    },
    planPrice: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelText: {
      marginTop: mvs(8),
      textAlign: 'center',
      color: theme.colors.secondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lottie: {
      width: ms(150),
      height: mvs(150),
      alignSelf: 'center',
    },
    noSubscriptionsText: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: mvs(10),
    },
    referText: {
      textAlign: 'center',
      color: theme.colors.secondary,
    },
    ownBadge: {
      top: mvs(-10),
      right: ms(15),
      position: 'absolute',
      paddingHorizontal: ms(10),
      backgroundColor: theme.colors.primary,
    },
    badgeText: {
      color: theme.colors.white,
    },
  });
