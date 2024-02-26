import { StyleSheet } from 'react-native';
import { ms, mvs } from 'react-native-size-matters';

import { scaledFontSize } from 'app/src/helpers';

export default (theme, isRTL) =>
  StyleSheet.create({
    question: {
      padding: ms(15),
      marginVertical: mvs(7),
      alignSelf: 'flex-end',
      marginHorizontal: ms(14),
      borderTopEndRadius: ms(18),
      borderTopStartRadius: ms(18),
      borderBottomEndRadius: ms(2),
      borderBottomStartRadius: ms(18),
      backgroundColor: '#2C2C2C',
    },
    questionText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.white,
      lineHeight: scaledFontSize(23),
    },
    answer: {
      direction: isRTL ? 'rtl' : 'ltr',
      marginVertical: mvs(7),
      marginHorizontal: ms(14),
      paddingVertical: ms(8),
      paddingHorizontal: ms(15),
      borderTopStartRadius: ms(2),
      borderTopEndRadius: ms(18),
      borderBottomEndRadius: ms(18),
      borderBottomStartRadius: ms(18),
      backgroundColor: theme.dark ? theme.colors.backdrop : theme.colors.lightGray,
    },
  });

export const markdownStyles = (theme, isRTL) => ({
  text: {
    ...theme.fonts.labelLarge,
    direction: isRTL ? 'rtl' : 'ltr',
    color: theme.dark ? theme.colors.white : theme.colors.black,
    lineHeight: scaledFontSize(23),
  },
  blockquote: {
    ...theme.fonts.labelLarge,
    direction: isRTL ? 'rtl' : 'ltr',
    color: theme.dark ? theme.colors.white : theme.colors.black,
  },
  em: {
    ...theme.fonts.bodySmall,
    color: theme.dark ? theme.colors.white : theme.colors.black,
    direction: isRTL ? 'rtl' : 'ltr',
    fontWeight: '500',
    fontSize: scaledFontSize(12.8),
    lineHeight: scaledFontSize(19),
  },
  codespan: {
    ...theme.fonts.labelLarge,
    fontWeight: 'bold',
    direction: isRTL ? 'rtl' : 'ltr',
    color: theme.dark ? theme.colors.white : theme.colors.black,
    backgroundColor: theme.dark ? theme.colors.secondaryContainer : 'transparent',
  },
  link: {
    ...theme.fonts.labelLarge,
    direction: isRTL ? 'rtl' : 'ltr',
  },
  code: {
    ...theme.fonts.labelLarge,
    flex: 1,
    padding: ms(16),
    borderRadius: ms(8),
    marginVertical: mvs(5),
    direction: isRTL ? 'rtl' : 'ltr',
    backgroundColor: theme.dark ? theme.colors.background : theme.colors.white,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderRadius: ms(2),
    borderColor: theme.colors.white,
    direction: isRTL ? 'rtl' : 'ltr',
  },
  li: {
    ...theme.fonts.labelLarge,
    flex: 1,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    direction: isRTL ? 'rtl' : 'ltr',
  },
});
