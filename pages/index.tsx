import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '../services/supabase/supabase';
import { store } from '../services/Store/store';
import { setCredentials } from '../services/Store/authSlice';
import { getServerSidePropsWrapper } from '../components/getServerSidePropsWrapper';
import { useQuery } from 'react-query';
import {
  ChallengeStepsView,
  ChallengeTimeLine,
} from '../components/challenges/ChallengeTimeline';
import { object } from 'yup';
const cos: GetServerSideProps = async (ctx) => {
  return { props: { value: 1 } };
};

const steps = {
  step1: {
    title: 'jeden',
    description: 'description jeden',
  },
  step2: {
    title: 'dwa',
    description: 'description jeden',
  },
  step3: {
    title: 'trzy',
    description: 'description jeden',
  },
  step4: {
    title: 'cztery',
    description: 'description jeden',
  },
};
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
