import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../app/services/auth';
import type { RootState } from './store';
import { supabase } from '../supabase/supabase';
type AuthState = {
  user: User | null;
  refresh_token: string | null;
  access_token: string | null;
};
const { user, refresh_token, access_token } =
  typeof window === 'undefined'
    ? {
        user: null,
        access_token: null,
        refresh_token: null,
      }
    : {
        user: null,
        access_token: null,
        refresh_token: null,
      };

  const initialState = { user, refresh_token, access_token };
console.log(supabase.auth.session());

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state = action.payload;
    },
    getCurrentUser: (state) => {
      console.log(state);

      return state;
    },
  },
});

export const { setCredentials, getCurrentUser } = authSlice.actions;

export default authSlice.reducer;
