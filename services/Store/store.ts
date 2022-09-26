import { configureStore, Store } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authApi } from './authApi';
import authSlice from './authSlice';
import { challengeApi } from './challengeApi';
import pageSlice from './pageSlice';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [challengeApi.reducerPath]: challengeApi.reducer,
    user: authSlice,
    page: pageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, challengeApi.middleware),
  devTools: true,
});

export const useStore = () => store;
export const dispatch = store.dispatch;
