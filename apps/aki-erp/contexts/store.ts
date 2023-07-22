import headerSlice from './headerSlice';
import modalSlice from './modalSlice';
import rightDrawerSlice from './rightDrawerSlice';

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
};

const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
