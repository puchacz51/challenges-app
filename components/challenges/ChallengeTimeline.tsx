import { useEffect, useState } from 'react';
import { ChallengeSteps } from '../forms/ChallengeSteps';

interface ChallengeTimeLineProps {
  challengeSteps: ChallengeSteps;
  startTime: string;
  endTime: string;
}
 const StepBtn = ({ step, startTime, endTime }: StepBtnProps) => {
   let stepPostion 
   if(step.time){
    stepPostion= (Date.parse(step.time) - Date.parse(startTime)) /
     (Date.parse(endTime) - Date.parse(startTime));
   }
   return <button className={`absolute left-[${stepPostion}%]`}>{step.title}</button>;
 };
const ChallengeTimeLine = ({
  challengeSteps,
  startTime,
  endTime,
}: ChallengeTimeLineProps) => {
  const stepLength = challengeSteps?.length;

  const calStepPosition = ()=>{
    const stepTimes = challengeSteps.map(step=>step.time)
    // const stepPosition = stepTimes.map(time => )

  }


  if (!stepLength) {
    return <h2>no steps </h2>;
  }

  return (
    <div className='h-[30px] bg-zinc-700 relative'>
      <div className='bg-green-500'>
        {challengeSteps.map((step) => (
          <StepBtn
            startTime={startTime}
            endTime={endTime}
            step={step}
            key={step.title}
          />
        ))}
      </div>
    </div>
  );
  interface StepBtnProps {
    startTime: string;
    endTime: string;
    step: ChallengeSteps[0];
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
