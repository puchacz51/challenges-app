import { configureStore, Store } from '@reduxjs/toolkit';
import next from 'next';
import { createWrapper } from 'next-redux-wrapper';
import { useContext } from 'react';
import { authApi } from './authApi';
import authSlice from './authSlice';
import { challengeApi } from './challengeApi';
import pageSlice from './pageSlice';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [challengeApi.reducerPath]: challengeApi.reducer,
    authInfo: authSlice,
    page: pageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, challengeApi.middleware),
  devTools: true,
});

export const useStore = () => store;
export const dispatch = store.dispatch;
