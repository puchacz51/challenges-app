import { NextPage } from 'next';
import { useRef } from 'react';
import LoginOptions from '../components/forms/LoginOptions';
import { authApi, useSignWithProviderQuery } from '../services/Store/authApi';
import { supabase } from '../services/supabase/supabase';

const LoginPage = (): JSX.Element => {
  const { data,refetch,isFetching } = useSignWithProviderQuery('github');

  return (
    <main className='min-h-screen'>
      <button onClick={refetch}>
        click me
      </button>
      {/* <LoginOptions></LoginOptions> */}
      {JSON.stringify(supabase.auth.user()?.email)}
    </main>
  );
};
export default LoginPage;
