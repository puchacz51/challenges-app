import { GetServerSideProps, NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import ViewChallenge from '../../components/challenges/ChallegeView';
import { setCredentials } from '../../services/Store/authSlice';
import { challengeApi } from '../../services/Store/challengeApi';
import { store } from '../../services/Store/store';
import { supabase } from '../../services/supabase/supabase';

const fetchChallenge = async (idChallenge) => {
  try {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('id', idChallenge);
    console.log(result.data);

    return result.data;
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

const Challenge: NextPage = ({ challengeId }) => {
  const { data, error, isLoading } = useQuery([challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled:false
  });
  if(!data) return<>
    stoop
  </>
  console.log(data);
  
  return <>
    <ViewChallenge challengeData={data[0]}></ViewChallenge>
  
  </>;
};

export default Challenge;
