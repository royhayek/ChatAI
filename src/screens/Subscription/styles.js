import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollViewContent: {
      padding: 16,
    },
    title: {
      marginTop: 5,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    benefitsContainer: {
      gap: 20,
      marginTop: 20,
      borderRadius: 18,
      marginHorizontal: 8,
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.white,
    },
    benefitContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    benefitTexts: {
      marginStart: 15,
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
      gap: 8,
      marginTop: 20,
      marginBottom: 10,
    },
    planContainer: isSelected => ({
      borderWidth: 1.5,
      borderRadius: 18,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderColor: isSelected ? theme.colors.primary : theme.colors.backdrop,
      backgroundColor: isSelected ? theme.colors.primaryLight : 'transparent',
    }),
    planTitle: {
      marginBottom: 3,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.secondary,
    },
    planPrice: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelText: {
      marginTop: 8,
      textAlign: 'center',
      color: theme.colors.secondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lottie: {
      width: 150,
      height: 150,
      alignSelf: 'center',
    },
    noSubscriptionsText: {
      textAlign: 'center',
      marginBottom: 10,
      fontWeight: 'bold',
    },
    referText: {
      textAlign: 'center',
      color: theme.colors.secondary,
    },
  });
