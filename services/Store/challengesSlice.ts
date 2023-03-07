import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
type ChallengesSlice = {
  selectedStepId: number | null;
};

let initialState: ChallengesSlice = {
  selectedStepId: 2,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    doo: () => {
      console.log(23);
    },
    setSelectedStep: (state, action: PayloadAction<number>) => {
      console.log(23);
      state.selectedStepId = action.payload;
      return state;
    },
  },
});

export const { setSelectedStep, doo } = challengesSlice.actions;

export default challengesSlice.reducer;
