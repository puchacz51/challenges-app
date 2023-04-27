import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabase';
type SupabaseSlice = {
  supabaseClient: SupabaseClient | null;
};
let initialState: SupabaseSlice = {
  supabaseClient: typeof window === 'undefined' ? null : supabase,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setSupabaseClient: (state, action: PayloadAction<SupabaseClient>) => {
      state.supabaseClient = action.payload;
      return state;
    },
  },
});

export const { setSupabaseClient } = challengesSlice.actions;

export default challengesSlice.reducer;
