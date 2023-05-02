import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

export type UserProfileSection = 'CHALLENGES' | 'STATS' | 'CONTRIBUTIONS';

type UserProfileState = {
  user: User | null;
  selectedSection: UserProfileSection;
};

const initialState: UserProfileState = {
  user: null,
  selectedSection: 'CHALLENGES',
};

const pageSlice = createSlice({
  initialState,
  name: 'userProfile',
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setSection: (state, action: PayloadAction<UserProfileSection>) => {
      state.selectedSection = action.payload;
    },
  },
});
1
export default pageSlice.reducer;
export const { setUser,setSection } = pageSlice.actions;

