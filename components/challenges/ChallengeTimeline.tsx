import { useEffect, useState } from 'react';
import { ChallengeSteps } from '../forms/ChallengeSteps';

interface ChallengeTimeLineProps {
  challengeSteps: ChallengeSteps;
  startTime: string;
  endTime: string;
}
const StepBtn = ({ step, position}: StepBtnProps) => {
  
  return (
    <button className={`absolute left-[${Math.round(position)}px]`}>
      {step.title}
    </button>
  );
};
const ChallengeTimeLine = ({
  challengeSteps,
  startTime,
  endTime,
}: ChallengeTimeLineProps) => {
  const stepeKeys = Object.keys(challengeSteps||{});
  const stepsLength = stepeKeys.length
  const calStepPosition = () => {
    const stepsWithTime = challengeSteps.filter((step) => !!step.time);
    const stepsNoTime = challengeSteps.filter((step) => !step.time);

    // const stepPosition = stepTimes.map(time => )
  };

  if (!stepsLength) {
    return <h2>no steps </h2>;
  }

  return (
    <div className='h-[30px] bg-zinc-700 relative '>
        {stepeKeys.map((key,i) => (
          <StepBtn
            position={100/(stepsLength+1)*(i+1)}
            step={challengeSteps[key]}
            key={key}
          />
        ))}
    </div>
  );
  interface StepBtnProps {
    step: ChallengeSteps[0];
    position :number
  }

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
