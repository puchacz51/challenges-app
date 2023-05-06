import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ChallengeStepsView } from '../components/challenges/ChallengeTimeline';
import { ChallengeStepForm } from '../components/forms/ChallengeSteps';
import Link from 'next/link';
import { useAppSelector } from '../services/Store/store';
import { HeaderLoginForm } from '../components/forms/HeaderLoginForm';
export const getServerSideProps: GetServerSideProps = async (ctx) => {

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

export default function Home() {
  const { user } = useAppSelector((state) => state.authInfo);

  return (
    <main>
      {/* <ChallengeStepsView
        challengeSteps={stepList}
        endTime={challengeEnd}
        startTime={challengeStart}
      /> */}
      <Link href='/myChallenges'>myChallenges</Link>
      <br />
      <Link href={`/${user?.id}`}>myProfile</Link>
<HeaderLoginForm/>


    </main>
  );
}
