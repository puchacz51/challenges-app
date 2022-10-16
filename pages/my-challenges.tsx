import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useEffect } from 'react';
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ChallengesList } from '../components/challenges/ChallengesList';
import ImageSlider from '../components/challenges/ImageSlider';
import { AddChellengeForm } from '../components/forms/AddChellenge';
import { useChallengeQuery } from '../components/utilities/usePostQuery';
import { setCredentials } from '../services/Store/authSlice';
import { RootState, store } from '../services/Store/store';
import { supabase } from '../services/supabase/supabase';

interface ServerProps {
  initialState: Object;
  userChallenges: Array<{}>;
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await supabase.auth.api.getUserByCookie(ctx.req);
  console.log(result);
  
  const { user, token } = result || { user: null, token: null };
  if (!user?.id || !token)
    return { redirect: { destination: '/login', permanent: false }, props: {} };
  store.dispatch(setCredentials({ user, token }));
  const queryClient = new QueryClient();

  await queryClient.fetchQuery([user.id], async () => {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', user.id);
    return result.data;
  });

  return {
    props: {
      initialState: store.getState(),
      queryState: dehydrate(queryClient),
    },
  };
};

export { getServerSideProps };

const MyChallenges: NextPage = (props: ServerProps) => {
  
  useEffect(() => {}, []);
  return (
    <main className='flex flex-col '>
      <ChellengesOption />
      <ChallengesList>  </ChallengesList>
      {/* <AddChellengeForm /> */}
      {/* <ChallengesList initialData={props.userChallenges} />  */}
    </main>
  );
};

export default MyChallenges;

const ChellengesOption = (): JSX.Element => {
  return (
    <div className='text-lg px-[5%] py-2 text-white bg-slate-900 '>Options</div>
  );
};


