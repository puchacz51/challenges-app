import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { store, useAppSelector } from '../services/Store/store';
import { setCredentials } from '../services/Store/authSlice';
import Image from 'next/image';
import {
  useChallengeQuery,
  useChallengesQuery,
} from '../components/utilities/useChallengeQuery';
import { ChallengeNode } from '../components/challenges/ChallengesList';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProfileSections } from '../components/userProfile/ProfileSections';

interface ServerProps {
  initialState: Object;
  userChallenges: Array<{}>;
  bucketPath: string;
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServer = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session || !session.user) {
    return { redirect: { destination: '/login', permanent: false }, props: {} };
  }
  const { user = null, access_token: token = null } = session;
  store.dispatch(setCredentials({ user, token }));
  const queryClient = new QueryClient();
  return {
    props: {
      store: store.getState(),
      queryState: dehydrate(queryClient),
    },
  };
};

export { getServerSideProps };

const UserProfile = () => {
  const { user } = useAppSelector((state) => state.authInfo);

  const [selectedSection, setSelectedSection] = useState<
    'CHALLENGES' | 'STATS'
  >('CHALLENGES');

  return (
    <main>
      <div className='border-2 border-black flex row  items-center p-2 gap-2'>
        <div className='w-20 aspect-square relative p-6 rounded-full overflow-hidden border-4 border-black'>
          <Image
            alt='challenge image'
            src={'https://avatars.githubusercontent.com/u/71950600?v=4'}
            fill
          />
        </div>
        <h3>{user?.email}</h3>
      </div>
      <ProfileSections />
    </main>
  );
};
export default UserProfile;
