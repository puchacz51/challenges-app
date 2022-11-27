import { ChallengeSteps } from '../forms/ChallengeSteps';

interface ChallengeTimeLineProps {
  challengeSteps: ChallengeSteps;
  startTime: string;
  endTime: string;
}

const ChallengeTimeLine = ({ challengeSteps }: ChallengeTimeLineProps) => {
  const stepLength = challengeSteps?.length;

  if (!stepLength) {
    return <h2>no steps </h2>;
  }

  return (
    <div className='h-[30px] bg-zinc-700 relative'>
      <div className='bg-green-500 '></div>
    </div>
  );

  // return (
  //   <div className='flex flex-col'>
  //     {challengeSteps.map((step) => (
  //       <>
  //         <h2 className='text-red-500'>{step.title}</h2>
  //         {step.description}
  //       </>
  //     ))}
  //   </div>
  // );
};

export { ChallengeTimeLine };
