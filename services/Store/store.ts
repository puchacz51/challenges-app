import {
  CombinedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import authSlice from './authSlice';
import challengesSlice from './challengesSlice';
import pageSlice from './pageSlice';
import challengesFilterSlice from './challengesFilterSlice';

const reducer = combineReducers({
  authInfo: authSlice,
  page: pageSlice,
  challenges: challengesSlice,
  challengesFilter: challengesFilterSlice,
});
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});
export { store };
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
