import { store } from 'app/src/redux/store';
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
const state = store.getState();

// Place your rewarded ad unit ids here
console.debug('state.app.config?.ads?.rewarded.ios', state.app.config?.ads?.rewarded.ios);
console.debug('state.app.config?.ads?.rewarded.android', state.app.config?.ads?.rewarded.android);
export const REWARDED_AD_UNIT_ID = Platform.select({
  ios: __DEV__ ? TestIds.REWARDED : state.app.config?.ads?.rewarded.ios || '',
  android: __DEV__ ? TestIds.REWARDED : state.app.config?.ads?.rewarded.android || '',
});

// Android app subscription app id (from google console)
export const PRODUCT_ID = 'chatai_pro';

export const Firebase = {
  CONFIGURATION_REF: 'configuration',
};

export const Endpoints = {
  TEXT_COMPLETIONS: 'completions',
  TEXT_COMPLETIONS_TURBO: 'chat/completions',
};
