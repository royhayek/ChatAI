import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  config: {
    ads: {
      rewarded: {
        android: '',
        ios: '',
      },
    },
  },
  language: 'en',
  themeMode: 'dark',
  messagesCount: 0,
  lastSentDate: null,
  lastRewardedDate: null,
  subscriptions: [],
  ownedSubscription: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setMessagesCount: (state, action) => {
      state.messagesCount = action.payload;
    },
    setLastSentDate: (state, action) => {
      state.lastSentDate = action.payload;
    },
    setLastRewardedDate: (state, action) => {
      state.lastRewardedDate = action.payload;
    },
    setPaidSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
    setOwnedSubscription: (state, action) => {
      state.ownedSubscription = action.payload;
    },
  },
});

export const {
  setConfig,
  setLanguage,
  setThemeMode,
  setMessagesCount,
  setLastSentDate,
  setLastRewardedDate,
  setPaidSubscriptions,
  setOwnedSubscription,
} = appSlice.actions;

export default appSlice.reducer;
