import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
  initialState: { path: '' },
  name: 'page',
  reducers: {
    setPath: (state, { payload }) => {
      state.path = payload;
    },
  },
});

export default pageSlice.reducer;
export const { setPath } = pageSlice.actions;
