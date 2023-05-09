import { GetServerSideProps } from 'next';
import ImageSlider from '../../components/challenges/ImageSlider';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, dehydrate } from 'react-query';
import { store, useAppSelector } from '../../services/Store/store';
import { setCredentials } from '../../services/Store/authSlice';
import {
  fetchChallenge,
  useChallengeQuery,
} from '../../components/utilities/useChallengeQuery';
import { AiFillEdit } from 'react-icons/ai';
import { useState } from 'react';
import { useCompleteStepMutation } from '../../components/utilities/useCompleteMutation';
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServerClient = createServerSupabaseClient(ctx);

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();
  if (!session) {
    return {
      redirect: { destination: '/login', permanent: 'false' },
      props: {},
    };
  }
  const { user = null, access_token: token } = session;
  const challengeId = ctx.query.id as string;
  const queryClient = new QueryClient();
  try {
    const challengedata = await fetchChallenge(challengeId);
    await queryClient.setQueryData(['challenge', challengeId], challengedata);
  } catch (err) {
    ctx.res.statusCode = 403;
    return {
      props: {},
    };
  }
  store.dispatch(setCredentials({ user, token }));

  return {
    props: {
      challengeId,
      queryState: dehydrate(queryClient),
      store: store.getState(),
    },
  };
};

const CompleteChallegeView = ({ challengeData }: { challengeData }) => {
  return;
};

const MyChallengeView = ({ challengeId }: { challengeId: string }) => {
  const { user } = useAppSelector((state) => state.UserProfile);
  const { data: challengeData } = useChallengeQuery(challengeId);
  const { title, images, challengeSteps, endTime, startTime, status } =
    challengeData;
  const { isLoading, mutate } = useCompleteStepMutation(challengeId);
  const [isEdited, setIsEdited] = useState();
  const changeStepStatus = (stepId: number, status: boolean) => {
    mutate({ stepId, status });
  };
  return (
    <main className='flex flex-col bg-slate-200'>
      <h2 className='text-3xl uppercase text-center bg-slate-900 py-1 text-white font-semibold'>
        {title}
      </h2>
      <ImageSlider imagesUrl={images}></ImageSlider>

      <div>
        <h4 className='text-3xl border-4 border-black font-semibold py-1 mb-2 border-t-0 text-center'>
          {' '}
          challenge steps
        </h4>
        {challengeSteps.map((step, i) => (
          <div
            key={step.stepId}
            className='grid grid-cols-2 grid-row-1  m-1 border-2 border-black'>
            <h3 className='flex  items-center px-2 text-xl border-r-2 border-black  '>
              {i + 1}.{step.title}
            </h3>
            <button
              onClick={() => changeStepStatus(step.stepId, !step.completed)}
              className={`uppercase font-bold border-4 border-black p-2 ${
                step.completed ? 'bg-green-600' : 'bg-red-600'
              }`}>
              {step.completed ? 'cancel' : 'complete'}
            </button>
          </div>
        ))}
        <button
          className={`uppercase text-3xl font-bold border-4 border-black p-2 ${
            status === 'COMPLETED' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {status === 'COMPLETED' ? 'cancel' : 'complete'}
        </button>

        <button className='fixed bottom-5 right-5 bg-yellow-300 text-4xl p-4 rounded-xl shadow-lg shadow-black border-2 border-black'>
          <AiFillEdit />
        </button>
      </div>
    </main>
  );
};
export default MyChallengeView;
