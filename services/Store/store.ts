import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import challengesSlice from './challengesSlice';
import pageSlice from './pageSlice';
import supabaseClient from './supabaseSlice';

const reducer = combineReducers({
  authInfo: authSlice,
  page: pageSlice,
  challenges: challengesSlice,
  // supabase: supabaseClient,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});
console.log('store created');

export { store };
export type RootState = ReturnType<typeof store.getState>;
