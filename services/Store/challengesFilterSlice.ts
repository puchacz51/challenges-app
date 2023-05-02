import { Action } from '@dnd-kit/core/dist/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export const CHALLENGECATEGORIES = [
  'SPORT',
  'CREATIVITY',
  'PERSONAL IMPROVEMENT',
] as const;
export const CHALLENGESTATUSES = [
  'COMPLETED',
  'ACTIVE',
  'ALL',
  'PAUSED',
] as const;

export type ChallengeCategory = (typeof CHALLENGECATEGORIES)[number];
export type ChallengeStatus = (typeof CHALLENGESTATUSES)[number];

export type ChallengesFilterSlice = {
  filterData: string | null;
  filterStatus: ChallengeStatus;
  filterIsPublic: 'PUBLIC' | 'PRIVATE' | 'ALL';
  filterCategory: ChallengeCategory[];
};
const initialState: ChallengesFilterSlice = {
  filterData: new Date(0, 0, 0).toUTCString(),
  filterStatus: 'ALL',
  filterIsPublic: 'ALL',
  filterCategory: ['CREATIVITY', 'PERSONAL IMPROVEMENT', 'SPORT'],
};
const challengesFilterSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<ChallengeCategory>) => {
      const { payload } = action;
      if (state.filterCategory.includes(payload)) {
        state.filterCategory = state.filterCategory.filter(
          (cat) => cat !== payload
        );
      } else {
        state.filterCategory = [...state.filterCategory, payload];
      }
      return state;
    },
    setFilterDate: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.filterData = action.payload;
      } else {
        state.filterData = initialState.filterData;
      }
    },
    setIsPublic: (
      state,
      action: PayloadAction<ChallengesFilterSlice['filterIsPublic']>
    ) => {
      state.filterIsPublic = action.payload;
      return state;
    },
    setFiterStatus: (
      state,
      action: PayloadAction<ChallengesFilterSlice['filterStatus']>
    ) => {
      state.filterStatus = action.payload;
      return state;
    },
    clearFilter: (state) => {
      state = initialState;
      return state;
    },
  },
});

export default challengesFilterSlice.reducer;
export const {
  setCategory,
  setFilterDate,
  setIsPublic,
  setFiterStatus,
  clearFilter,
} = challengesFilterSlice.actions;
