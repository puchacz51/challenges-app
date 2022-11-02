import { GetServerSideProps, NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import ViewChallenge from '../../components/challenges/ChallegeView';
import challengeReactions from '../../components/challenges/challengeReactions';
import ChallengeReactions from '../../components/challenges/challengeReactions';
import ImageSlider from '../../components/challenges/ImageSlider';
import { setCredentials } from '../../services/Store/authSlice';
import { RootState, store } from '../../services/Store/store';
import { supabase } from '../../services/supabase/supabase';
import { fetchChallenge, useChallengeQuery } from './useChallengeQuery';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: user, token } = await supabase.auth.api.getUserByCookie(
    ctx.req
  );
  store.dispatch(setCredentials({ user, token }));
  const queryClient = new QueryClient();
  const challengeId = ctx.query.id;
  await queryClient.fetchQuery(['challenge', Number(challengeId)], () =>
    fetchChallenge(Number(challengeId), user.id)
  );

  return { props: { challengeId, queryState: dehydrate(queryClient) } };
};

const Challenge: NextPage = ({ challengeId }: { challengeId: string }) => {
  const user = useSelector<RootState>((state) => state.authInfo.user);
  const { data, error, isLoading } = useChallengeQuery(
    Number(challengeId),
    user?.id
  );
  if (isLoading) return <>loading...</>;
  if (!data)
    return (
      <>
        {Number(challengeId)} {data}
      </>
    );
  const { title, description, createdAt, images } = data.challenge;
  const challengeReactions = data.reactions;
      console.log(data);
      
  return (
    <>
      <div className='flex flex-col bg-slate-200'>
        <h2 className='text-3xl uppercase text-center bg-slate-500 font-semibold'>
          {title}
        </h2>
        <ImageSlider imagesUrl={images}></ImageSlider>
        <p>{description}</p>
        <span>created at {new Date(createdAt).toDateString()}</span>
        <ChallengeReactions reactionsData={challengeReactions} />
      </div>
    </>
  );
};

export default Challenge;
