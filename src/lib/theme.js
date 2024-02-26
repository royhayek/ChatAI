import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme, configureFonts } from 'react-native-paper';
import { scaledFontSize } from '../helpers';

const fontConfig = {
  displaySmall: {
    fontSize: scaledFontSize(36),
    lineHeight: scaledFontSize(44),
  },
  displayMedium: {
    fontSize: scaledFontSize(45),
    lineHeight: scaledFontSize(52),
  },
  displayLarge: {
    fontSize: scaledFontSize(57),
    lineHeight: scaledFontSize(64),
  },
  headlineSmall: {
    fontSize: scaledFontSize(24),
    lineHeight: scaledFontSize(32),
  },
  headlineMedium: {
    fontSize: scaledFontSize(28),
    lineHeight: scaledFontSize(36),
  },
  headlineLarge: {
    fontSize: scaledFontSize(32),
    lineHeight: scaledFontSize(40),
  },
  titleSmall: {
    fontSize: scaledFontSize(14),
    lineHeight: scaledFontSize(20),
  },
  titleMedium: {
    fontSize: scaledFontSize(16),
    lineHeight: scaledFontSize(24),
  },
  titleLarge: {
    fontSize: scaledFontSize(22),
    lineHeight: scaledFontSize(28),
    fontWeight: 600,
  },
  labelSmall: {
    fontSize: scaledFontSize(11),
    lineHeight: scaledFontSize(16),
  },
  labelMedium: {
    fontSize: scaledFontSize(12),
    lineHeight: scaledFontSize(16),
  },
  labelLarge: {
    fontSize: scaledFontSize(14),
    lineHeight: scaledFontSize(20),
  },
  bodySmall: {
    fontSize: scaledFontSize(12),
    lineHeight: scaledFontSize(16),
  },
  bodyMedium: {
    fontSize: scaledFontSize(14),
    lineHeight: scaledFontSize(20),
  },
  bodyLarge: {
    fontSize: scaledFontSize(16),
    lineHeight: scaledFontSize(24),
  },
};

const fonts = configureFonts({ config: fontConfig });

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
  fonts: {
    ...DefaultTheme.fonts,
    fonts,
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
  fonts: {
    ...DefaultTheme.fonts,
    fonts,
  },
};
