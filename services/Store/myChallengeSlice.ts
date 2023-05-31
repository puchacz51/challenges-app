import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
type ViewOptions = 'STATUS' | 'INFO';
type MyChallengeSlice = {
  selectedView: ViewOptions;
  editOptionIsOpen: boolean;
};

let initialState: MyChallengeSlice = {
  selectedView: 'INFO',
  editOptionIsOpen: false,
};
const challengesSlice = createSlice({
  name: 'myChallenge',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ViewOptions>) => {
      state.editOptionIsOpen = false;
      state.selectedView = action.payload;
      return state;
    },
    setEditOptionIsOpen: (state, action: PayloadAction<boolean>) => {
      state.editOptionIsOpen = action.payload;
      return state;
    },
  },
});
export const { setView, setEditOptionIsOpen } = challengesSlice.actions;
export default challengesSlice.reducer;
