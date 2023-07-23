import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    primaryLight: 'rgba(255, 99, 71, 0.2)',
    secondary: 'gray',
    white: 'white',
    background: '#F9F9F9',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'tomato',
    primaryLight: 'rgba(255, 99, 71, 0.2)',
    secondary: 'gray',
    white: 'white',
  },
};
