import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

export const DAILY_USAGE_LIMIT = 5;

// Place your rewarded ad unit ids here
export const REWARDED_AD_UNIT_ID = Platform.select({
  ios: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1469570455778464/4453655521',
  android: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1469570455778464/6899068074',
});

export const APPLEAPPID = '2193813192';
export const GOOGLEPACKAGENAME = 'com.mywebsite.myapp';

export const PRIVACY_POLICY = 'https://code-blow.com/chatAi/privacy_policy.html'; // Place your privacy policy link here
export const TERMS_AND_CONDITIONS = 'https://code-blow.com/chatAi/terms.html'; //  Place your privacy policy link here

// Android app subscription app id (from google console)
export const PRODUCT_ID = 'chatai_pro';

// Android app subscription plan ids (from google console)
export const WEEKLY_BASE_PLAN = 'conversai-pro';
export const MONTHLY_BASE_PLAN = 'conversai-pro-month';
export const YEARLY_BASE_PLAN = 'conversai-pro-year';

export const MATCH_RESULT_STRING = '"text":';
export const MATCH_RESULT_TURBO_STRING = '"content":';

export const TRANSITION_ANIMATION_DURATION = 400;
export const IS_DELETE = 'is_delete';

export const Firebase = {
  CONVERSATION_COLLECTION: 'conversations',
  MESSAGE_COLLECTION: 'messages',
};

export const Endpoints = {
  TEXT_COMPLETIONS: 'completions',
  TEXT_COMPLETIONS_TURBO: 'chat/completions',
};

export const Examples = [
  'Can you make a puzzle game where a 4-digit code is the solution?',
  "Can you give me 5 free techniques on how to boost my website's organic traffic?",
  'How can I develop my own unique style as an artist? Give me the steps to start my journey',
];
