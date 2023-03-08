import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import challengesSlice from './challengesSlice';
import pageSlice from './pageSlice';
const reducer = combineReducers({
  authInfo: authSlice,
  page: pageSlice,
  challenges: challengesSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export { store };
export type RootState = ReturnType<typeof store.getState>;


