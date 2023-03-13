import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
type ChallengesSlice = {
  selectedStepId: number | null;
  listIsOpen: boolean;
};

let initialState: ChallengesSlice = {
  selectedStepId: null,
  listIsOpen: false,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setSelectedStep: (state, action: PayloadAction<number>) => {
      if (state.selectedStepId === action.payload) {
        state.selectedStepId = null;
      } else {
        state.selectedStepId = action.payload;
        state.listIsOpen = true;
      }
      return state;
    },
    setIsOpenList: (state, action: PayloadAction<boolean>) => {
      state.listIsOpen = action.payload;
      return state;
    },
  },
});

export const { setSelectedStep, setIsOpenList } = challengesSlice.actions;

export default challengesSlice.reducer;
