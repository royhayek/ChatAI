import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  themeMode: 'dark',
  messagesCount: 0,
  lastSentDate: null,
  subscriptions: [],
  ownedSubscription: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
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
    setPaidSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
    setOwnedSubscription: (state, action) => {
      state.ownedSubscription = action.payload;
    },
  },
});

export const {
  setLanguage,
  setThemeMode,
  setMessagesCount,
  setLastSentDate,
  setPaidSubscriptions,
  setOwnedSubscription,
} = appSlice.actions;

export default appSlice.reducer;
