import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '../services/supabase/supabase';
import { store } from '../services/Store/store';
import { setCredentials } from '../services/Store/authSlice';
import { getServerSidePropsWrapper } from '../components/getServerSidePropsWrapper';
import { useQuery } from 'react-query';
import {
  ChallengeStepsView,
} from '../components/challenges/ChallengeTimeline';
import { ChallengeStepForm } from '../components/forms/ChallengeSteps';
const cos: GetServerSideProps = async (ctx) => {
  return { props: { value: 1 } };
};

const steps: ChallengeStepForm[] = [
  {
    title: 'Step 1',
    description: 'Description for Step 1',
    time: '2022-05-15T12:30:00.000Z',
    challengeId: 1,
    stepId: 1,
    completed: true,
  },
  {
    title: 'Step 2',
    description: 'Description for Step 2',
    time: '2022-05-16T08:45:00.000Z',
    challengeId: 1,
    stepId: 2,
    completed: true,
  },
  {
    title: 'Step 3',
    time: '2022-05-17T15:20:00.000Z',
    description: 'Description for Step 5',

    challengeId: 1,
    stepId: 3,
  },
  {
    title: 'Step 4',
    description: 'Description for Step 4',
    time: '2022-05-18T17:00:00.000Z',
    challengeId: 1,
    stepId: 4,
  },
  {
    title: 'Step 5',
    description: 'Description for Step 5',

    time: '2022-05-19T09:10:00.000Z',
    challengeId: 1,
    stepId: 5,
  },
];

const challengeStart = new Date(2021, 11, 1).toISOString();
const challengeEnd = new Date(2022, 2, 2).toISOString();
const stepList = Object.keys(steps).map((key) => ({ ...steps[key], id: key }));
export const getServerSideProps = getServerSidePropsWrapper(cos);

export default function Home(props) {
  return (
    <main>
      <ChallengeStepsView
        challengeSteps={stepList}
        endTime={challengeEnd}
        startTime={challengeStart}
      />
    </main>
  );
}
