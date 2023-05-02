import {
  CombinedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './authSlice';
import challengesSlice from './challengesSlice';
import pageSlice from './userProfileSlice';
import challengesFilterSlice from './challengesFilterSlice';
import userProfileSlice from './userProfileSlice';

const reducer = combineReducers({
  authInfo: authSlice,
  UserProfile: userProfileSlice,
  challenges: challengesSlice,
  challengesFilter: challengesFilterSlice,
});
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});
export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
