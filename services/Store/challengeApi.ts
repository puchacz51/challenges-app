import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { supabase } from '../supabase/supabase';
import { setCredentials } from './authSlice';
import { store } from './store';
export const challengeApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['chellenge'],

  endpoints: (build) => ({
    getMyChallenges: build.query({
      async queryFn(args, { getState }) {
        const myId = 2;

        if (!myId) {
          return { error: 'not logged user' };
        }
        const result = supabase
          .from('challenges')
          .select('*')
          .eq('userId', myId);

        return { data: result };
      },
    }),
    getMyChallenge: build.query({
      async queryFn(_, { getState }) {
        const myId = getState();
        console.log(myId, 33);

        if (!myId) {
          return { error: 'not logged user' };
        }
        const result = supabase
          .from('challenges')
          .select('*')
          .eq('userId', myId);

        return { data: result };
      },
    }),
  }),
});

export const { useGetMyChallengeQuery } = challengeApi;
