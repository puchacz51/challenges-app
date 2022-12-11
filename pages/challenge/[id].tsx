import { User } from '@supabase/supabase-js';
import { GetServerSideProps, NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import ChallengeReactions, {
  Reaction,
} from '../../components/challenges/ChallengeReactions';
import { ChallengeTimeLine } from '../../components/challenges/ChallengeTimeline';
import ImageSlider from '../../components/challenges/ImageSlider';
import { setCredentials } from '../../services/Store/authSlice';
import { RootState, store } from '../../services/Store/store';
import { supabase } from '../../services/supabase/supabase';
import {
  fetchChallenge,
  fetchChallengeReactions,
  useChallengeQuery,
  useChallengeReactionQuery,
} from './useChallengeQuery';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    data: userData,
    token,
    error,
    user: aa,
  } = await supabase.auth.api.getUserByCookie(ctx.req);
  store.dispatch(setCredentials({ user: userData, token }));

  const user = userData || { id: null, token: null };
console.log(error);

  const queryClient = new QueryClient();
  const challengeId = ctx.query.id as string;

  await queryClient.fetchQuery(['challenge', challengeId], async () =>
    fetchChallenge(challengeId)
  );
  await queryClient.fetchQuery(['reactions', challengeId, user.id], () =>
    fetchChallengeReactions(challengeId, user.id)
  );

  return {
    props: {
      challengeId,
      queryState: dehydrate(queryClient),
      store: store.getState(),
    },
  };
};

const Challenge: NextPage = ({ challengeId }: { challengeId: string }) => {
  const user = useSelector<RootState>((state) => state.authInfo.user) as User;
  const { data: challenge, error, isLoading } = useChallengeQuery(challengeId);

  if (isLoading) return <>loading...</>;
  if (!challenge)
    return (
      <>
        {challengeId} {challenge}
      </>
    );
  const { title, description, createdAt, images, challengeSteps } = challenge;
  return (
    <>
      <div className='flex flex-col bg-slate-200'>
        <h2 className='text-3xl uppercase text-center bg-slate-500 font-semibold'>
          {title}
        </h2>
        <ImageSlider imagesUrl={images}></ImageSlider>
        <p>{description}</p>
        <span>created at {new Date(createdAt).toDateString()}</span>
        <ChallengeReactions userId={user?.id} challengeId={challengeId} />
        <ChallengeTimeLine
          challengeSteps={challengeSteps}
          startTime={challenge.startTime}
          endTime={challenge.endTime}
        />
      </div>
    </>
  );
};

export default Challenge;
