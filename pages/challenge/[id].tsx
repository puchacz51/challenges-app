import { GetServerSideProps, NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import ViewChallenge from '../../components/challenges/ChallegeView';
import { setCredentials } from '../../services/Store/authSlice';
import { store } from '../../services/Store/store';
import { supabase } from '../../services/supabase/supabase';

const fetchChallenge = async (idChallenge) => {
  try {
    const challenge = await supabase
      .from('challenges')
      .select('*,reactions(userId,reaction)')
      .eq('id', idChallenge);
    const reactions = await supabase
      .from('reactions')
      .select('reaction,userId')
      .eq('challengeId', idChallenge);
    return { challenge: challenge.data[0], reactions: reactions.data };
  } catch (err) {
    throw err;
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: user, token } = await supabase.auth.api.getUserByCookie(
    ctx.req
  );
  store.dispatch(setCredentials({ user, token }));

  const queryClient = new QueryClient();
  const challengeId = ctx.query.id;
  await queryClient.fetchQuery([challengeId], () =>
    fetchChallenge(challengeId)
  );

  return { props: { challengeId, queryState: dehydrate(queryClient) } };
};

const Challenge: NextPage = ({ challengeId }: { challengeId: string }) => {
  const { data, error, isLoading } = useQuery([challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled: false,
  });

  if (!data) return <>stoop</>;
  return (
    <>
      <ViewChallenge challengeData={data}></ViewChallenge>
    </>
  );
};

export default Challenge;
