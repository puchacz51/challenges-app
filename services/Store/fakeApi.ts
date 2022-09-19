import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { HYDRATE } from 'next-redux-wrapper';
export const fakeApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['fake'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    getTime: build.query({
      async queryFn() {
        const result = await setTimeout(() => Math.random(), 3000);

        return { data: result };
      },
    }),
  }),
});

export const { useGetTimeQuery } = fakeApi;
