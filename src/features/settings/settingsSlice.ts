import { createSlice } from '@reduxjs/toolkit';

type CurrentThemeType = 'light' | 'dark';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    currentTheme: 'light' as CurrentThemeType,
  },
  reducers: {
    setInitialTheme: (state) => {
      const currentTheme = localStorage.getItem(
        'theme'
      ) as CurrentThemeType | null;

      if (currentTheme) {
        return { ...state, currentTheme };
      }

      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return { ...state, currentTheme: 'dark' };
      }
      return { ...state, currentTheme: 'light' };
    },
    setCurrentTheme: (state, action) => {
      return { ...state, currentTheme: action.payload };
    },
  },
});

export const { setInitialTheme, setCurrentTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
