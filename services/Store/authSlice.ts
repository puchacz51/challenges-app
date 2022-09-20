import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../app/services/auth';
import type { RootState } from './store';
import { supabase } from '../supabase/supabase';
import { useMemo, useState } from 'react';

type AuthState = {
  user: User | null;
  token: string | null;
};
const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      console.log(1);
      
      state.user = user;
      state.token = token;
    },
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;

