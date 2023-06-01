import { GetServerSideProps } from 'next';
import ImageSlider from '../../components/challenges/ImageSlider';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, dehydrate } from 'react-query';
import { store, useAppSelector } from '../../services/Store/store';
import { setCredentials } from '../../services/Store/authSlice';
import { useChallengeQuery } from '../../components/utilities/useChallengeQuery';
import { HTMLAttributes, useEffect, useState } from 'react';
import {
  useCompleteChallengeMutation,
  useCompleteStepMutation,
} from '../../components/utilities/useCompleteMutation';
import { MyChallengeEditOption } from '../../components/challenges/MyChallengeEditOptions';
import { setCurrentChallenge } from '../../services/Store/myChallengeSlice';
import { ChallengeWithSteps } from '../../types/challengeTypes';
import { useDispatch } from 'react-redux';
import { UpdateChallengeForm } from '../../components/forms/UpdateChallengeForm/UpdateChallengeForm';
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
    const { data: challengedata, error: challengeError } =
      await supabaseServerClient
        .from('challenges')
        .select('*,challengeSteps(*)')
        .eq('id', challengeId);
    queryClient.setQueryData(['challenge', challengeId], challengedata[0]);
    store.dispatch(setCurrentChallenge(challengedata[0] as ChallengeWithSteps));
    if (challengeError || challengedata.length != 1) throw new Error();
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

const btnStatusStyle = new Map<
  String,
  HTMLAttributes<HTMLButtonElement>['className']
>([
  ['COMPLETED', 'bg-green-600'],
  ['PENDING', 'bg-blue-700'],
]);

const MyChallengeView = ({
  challengeId,
  ...props
}: {
  challengeId: string;
}) => {
  const { user } = useAppSelector((state) => state.UserProfile);
  const { selectedView } = useAppSelector((state) => state.myChallenge);
  const dispatch = useDispatch();
  const { data: challengeData } = useChallengeQuery(challengeId);
  const { title, images, challengeSteps, endTime, startTime, status } =
    challengeData;
  const {
    isLoading: stepIsMutating,
    mutate,
    variables: mutatingStep,
  } = useCompleteStepMutation(challengeId);
  const changeStepStatus = (stepId: number, status: boolean) => {
    mutate({ stepId, status });
  };
  const allStepCompleted =
    (challengeSteps &&
      challengeSteps.findIndex((step) => step.completed !== true) === -1) ||
    !challengeSteps;
  const { isLoading: challengeIsMutating, mutate: mutateChallenge } =
    useCompleteChallengeMutation(challengeId);

  useEffect(() => {
    dispatch(setCurrentChallenge(challengeData));
  }, []);

  if (selectedView === 'INFO') {
    return <UpdateChallengeForm />;
  }

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
              disabled={stepIsMutating}
              onClick={() => changeStepStatus(step.stepId, !step.completed)}
              className={`uppercase font-bold border-4 border-black p-2 ${
                step.completed ? 'bg-green-600' : 'bg-red-600'
              }`}>
              {step.completed ? 'COMPLETED' : 'PENDING'}
            </button>
          </div>
        ))}
        <button
          disabled={!allStepCompleted && status !== 'COMPLETED'}
          onClick={() =>
            mutateChallenge(status !== 'COMPLETED' ? 'COMPLETED' : 'PENDING')
          }
          className={`uppercase text-3xl font-bold border-4 border-black p-2 w-2/3 mx-auto ${btnStatusStyle.get(
            status
          )}
          disabled:bg-gray-500
          `}>
          {status === 'COMPLETED' ? 'cancel' : 'complete'}
        </button>
        <MyChallengeEditOption />
      </div>
    </main>
  );
};
export default MyChallengeView;
