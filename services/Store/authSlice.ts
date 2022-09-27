import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../app/services/auth';
import type { RootState } from './store';
import { supabase } from '../supabase/supabase';
type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'authInfo',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
  },
});

export const { setCredentials, getCurrentUser } = authSlice.actions;

export default authSlice.reducer;
