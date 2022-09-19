import {
  createApi,
  fakeBaseQuery,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { supabase } from '../supabase/supabase';

export const authApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: 'auth',
  endpoints: (build) => ({
    signWithProvider: build.query({
      async queryFn(provider) {
        const userData = await supabase.auth.signIn(
          { provider },
          { redirectTo: window.location.href }
        );
        if (userData.error) {
          return {
            error: userData.error,
          };
        }
        return { data: userData };
      },
    }),
  }),
});

export const { useSignWithProviderQuery } = authApi;
