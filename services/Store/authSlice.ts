import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
type AuthState = {
  user: User | null;
  token: string | null;
};

let initialState: AuthState = {
  user: null,
  token: null,
};

if (typeof window !== 'undefined') {
  const { user, access_token: token } = { access_token: null, user: null };
  initialState = { user, token };
} else {
}
const authSlice = createSlice({
  name: 'authInfo',
  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
