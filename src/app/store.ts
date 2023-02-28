import headerSlice from 'features/common/headerSlice';
import modalSlice from 'features/common/modalSlice';
import rightDrawerSlice from 'features/common/rightDrawerSlice';
import leadsSlice from 'features/leads/leadSlice';

import { configureStore } from '@reduxjs/toolkit';

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
};

const store = configureStore({
  reducer: combinedReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
