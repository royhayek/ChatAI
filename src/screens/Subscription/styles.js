import { StyleSheet } from 'react-native';

export default makeStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    flex1: {
      flex: 1,
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
      backgroundColor: theme.dark ? theme.colors.backdrop : 'white',
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
      color: theme.dark ? 'white' : 'black',
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
  });
