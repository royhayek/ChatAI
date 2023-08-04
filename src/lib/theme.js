import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#469BF8',
    primaryLight: '#469BF820',
    secondary: 'gray',
    white: '#FFFFFF',
    black: '#000029',
    background: '#F9F9F9',
    lightGray: '#E4E5EE',
    darkBlue: '#906FE7',
    pieBlue: '#9b59b6',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#469BF8',
    primaryLight: '#469BF820',
    secondary: 'gray',
    white: '#FFFFFF',
    black: '#000029',
    lightGray: '#E4E5EE',
    darkBlue: '#906FE7',
    pieBlue: '#9b59b6',
  },
};
