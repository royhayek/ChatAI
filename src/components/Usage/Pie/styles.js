import { scaledFontSize } from 'app/src/helpers';
import { StyleSheet } from 'react-native';

export default theme =>
  StyleSheet.create({
    valueText: {
      fontSize: scaledFontSize(16),
    },
  });
