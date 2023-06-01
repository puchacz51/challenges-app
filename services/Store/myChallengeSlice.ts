import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Challenge, ChallengeWithSteps } from '../../types/challengeTypes';
type ViewOptions = 'STATUS' | 'INFO';
type MyChallengeSlice = {
  selectedView: ViewOptions;
  editOptionIsOpen: boolean;
  selectedChallengeId: string;
  currrentChallenge: ChallengeWithSteps;
};

let initialState: MyChallengeSlice = {
  selectedView: 'INFO',
  editOptionIsOpen: false,
  selectedChallengeId: '',
  currrentChallenge: null,
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
    setSelectedChallengeId: (state, action: PayloadAction<string>) => {
      state.selectedChallengeId = action.payload;
      console.log(action.payload);
    },
    setCurrentChallenge: (state, action: PayloadAction<ChallengeWithSteps>) => {
      state.currrentChallenge = action.payload;
    },
  },
});
export const { setView, setEditOptionIsOpen, setCurrentChallenge } =
  challengesSlice.actions;
export default challengesSlice.reducer;
