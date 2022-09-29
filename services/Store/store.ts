import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import pageSlice from './pageSlice';
const reducer = combineReducers({
  authInfo: authSlice,
  page: pageSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export { store };
store.dispatch;

export type RootState = ReturnType<typeof store.getState>;