import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { ChallengesList } from '../../components/challenges/ChallengesList';
import { setCredentials } from '../../services/Store/authSlice';
import { store } from '../../services/Store/store';
import { supabase } from '../../services/supabase/supabase';
import { RiAddFill } from 'react-icons/ri';
const ChallangeForm = dynamic(
  () => import('../../components/forms/AddChellenge')
);

interface ServerProps {
  initialState: Object;
  userChallenges: Array<{}>;
  bucketPath: string;
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await supabase.auth.api.getUserByCookie(ctx.req);
  const { user, token } = result || { user: null, token: null };
  if (!user?.id || !token)
    return { redirect: { destination: '/login', permanent: false }, props: {} };
  store.dispatch(setCredentials({ user, token }));
  const queryClient = new QueryClient();
  const bucketPath = await supabase.storage.getBucket('challenge');
  await queryClient.fetchQuery([user.id], async () => {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', user.id);
    return result.data;
  });

  return {
    props: {
      store: store.getState(),
      queryState: dehydrate(queryClient),
      bucketPath,
    },
  };
};

export { getServerSideProps };

const MyChallenges: NextPage = (props: ServerProps) => {
  const [challangeFormIsVisible, setChallangeFormIsVisible] = useState(false);

  return (
    <main className='flex flex-col '>
      {challangeFormIsVisible && (
        <ChallangeForm cancelForm={() => setChallangeFormIsVisible(false)} />
      )}
      <button
        className='fixed right-4 bottom-4 z-20 leading-none p-1 bg-yellow-300 rounded-xl text-6xl font-extrabold'
        onClick={() => setChallangeFormIsVisible(true)}>
        <RiAddFill />
      </button>
      <ChallengesList />
    </main>
  );
};

export default MyChallenges;

// const ChellengesOption = (): JSX.Element => {
//   return (
//     <div className='text-lg px-[5%] py-2 text-white bg-slate-900 '>Options</div>
//   );
// };
