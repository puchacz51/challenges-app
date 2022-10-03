import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useEffect } from 'react';
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AddChellengeForm } from '../components/forms/AddChellenge';
import { setCredentials } from '../services/Store/authSlice';
import { RootState, store } from '../services/Store/store';
import { supabase } from '../services/supabase/supabase';

interface ServerProps {
  initialState: Object;
  userChallenges: Array<{}>;
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await supabase.auth.api.getUserByCookie(ctx.req);
  const { user, token } = result || { user: null, token: null };
  if (!user?.id || !token) return { redirect: '/login', props: {} };
  store.dispatch(setCredentials({ user, token }));
  const queryClient = new QueryClient();

  await queryClient.fetchQuery(['myChallenges'], async () => {
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
      <AddChellengeForm />
      <ChellengesList initialData={props.userChallenges} />
    </main>
  );
};

export default MyChallenges;

const ChellengesOption = (): JSX.Element => {
  return (
    <div className='text-lg px-[5%] py-2 text-white bg-slate-900 '>Options</div>
  );
};

const fetchChallenges = async (userId) => {
  try {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', userId);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const ChellengesList = ({ initialData }): JSX.Element => {
  const user = useSelector<RootState>((state) => state.authInfo?.user) as User;

  const { data, refetch, isLoading } = useQuery(['myChallenges'], () =>
    fetchChallenges(user?.id)
  );

  if (isLoading && !data) {
    return <h2>loading ...</h2>;
  }

  return (
    <div className='min-h-[200px] bg-slate-500 mx-[5%] border-4 mt-2 border-yellow-400'>
      {data?.map((challengeData) => (
        <ChellengeNode key={challengeData.id} challengeData={challengeData} />
      ))}
      <button onClick={(e) => refetch()}>refetch</button>
    </div>
  );
};
const ChellengeNode = ({ challengeData }): JSX.Element => {
  const { title } = challengeData;
  return (
    <div className='grid grid-rows-5 grid-cols-4 rounded '>
      <div className='col-span-4 row-span-4 bg-slate-200 relative h-[150px]'>
        <Image
          src='https://tueuropa.pl/uploads/articles_files/2021/11/05/6e7f9516-1948-d9e8-ca22-00007380aca5.jpg'
          objectFit='cover'
          layout='fill'
          alt='title image'></Image>
        <h3 className=' text-4xl absolute bottom-0 left-2  '>{title}</h3>
      </div>

      <span className='col-span-2 '>time</span>
      <span className='col-span-2'>status</span>
    </div>
  );
};
