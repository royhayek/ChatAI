import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  themeMode: 'dark',
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
  },
});

export const { setLanguage, setThemeMode } = appSlice.actions;

export default appSlice.reducer;
