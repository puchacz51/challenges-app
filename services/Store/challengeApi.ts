import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { supabase } from '../supabase/supabase';
export const challengeApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['chellenge'],

  endpoints: (build) => ({
    getMyChallenges: build.query({
      async queryFn(args, { getState }) {
        const myId = getState();
        console.log(myId);

        if (!true) {
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
        console.log('zle');

        console.log(myId, 34242);

        if (true) {
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

export const { useGetMyChallengeQuery, useGetMyChallengesQuery } = challengeApi;
