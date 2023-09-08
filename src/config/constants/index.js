import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { store } from 'app/src/redux/store';
import { t } from '../i18n';

const state = store.getState();

// Modify the app languages from here
// Uncomment the line below and replace "language" and "key" with the language
export const Languages = [
  // { locale: 'language', title: t('settings.languages.lang') },
  { locale: 'en', title: t('settings.languages.english') },
  { locale: 'fr', title: t('settings.languages.french') },
  { locale: 'ar', title: t('settings.languages.arabic') },
];

// Place your rewarded ad unit ids heres
export const REWARDED_AD_UNIT_ID = Platform.select({
  ios: __DEV__ ? TestIds.REWARDED : state.app.config?.ads?.rewarded.ios || '',
  android: __DEV__ ? TestIds.REWARDED : state.app.config?.ads?.rewarded.android || '',
});

export const Firebase = {
  CONFIGURATION_REF: 'configuration',
};

export const Endpoints = {
  TEXT_COMPLETIONS: 'completions',
  TEXT_COMPLETIONS_TURBO: 'chat/completions',
};
