import headerSlice from 'features/common/headerSlice';
import modalSlice from 'features/common/modalSlice';
import rightDrawerSlice from 'features/common/rightDrawerSlice';
import leadsSlice from 'features/leads/leadSlice';
import settingsSlice from 'features/settings/settingsSlice';

import { configureStore, Middleware } from '@reduxjs/toolkit';

const localStorageMiddleware: Middleware<unknown> = () => {
  return (next) => (action) => {
    const { type, payload } = next(action);

    if (type === 'settings/setCurrentTheme') {
      localStorage.setItem('theme', payload);
    }

    return { type, payload };
  };
};

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  settings: settingsSlice,
};

const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
