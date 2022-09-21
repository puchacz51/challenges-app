import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { authApi } from './authApi';
import authSlice  from './authSlice';
import { fakeApi } from './fakeApi';
import pageSlice from './pageSlice';

let store;
const initialState = {};
const initStore = (preloadedState = initialState) =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [fakeApi.reducerPath]: fakeApi.reducer,
      user: authSlice,
      page:pageSlice
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, fakeApi.middleware),
  });

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export function removeUndefined(state) {
  if (typeof state === 'undefined') return null;
  if (Array.isArray(state)) return state.map(removeUndefined);
  if (typeof state === 'object' && state !== null) {
    return Object.entries(state).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: removeUndefined(value),
      };
    }, {});
  }

  return state;
}
