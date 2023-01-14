import { UniqueIdentifier } from '@dnd-kit/core';
import { ChallengeStepForm, ChallengeSteps } from '../forms/ChallengeSteps';

interface ChallengeTimeLineProps {
  challengeSteps: ChallengeStepForm[];
  startTime: string;
  endTime: string;
}
interface StepBtnProps {
  step: ChallengeSteps[UniqueIdentifier];
  position: number;
  index: number;
}
interface StepListProps {
  challengeSteps: ChallengeSteps;
  activeStep: UniqueIdentifier;
}
interface StepBtnProps {
  step: ChallengeSteps[0];
  position: number;
}

const StepsList = ({ challengeSteps, activeStep }: StepListProps) => {
  return (
    <div>
      {challengeSteps.map((step) => (
        <div key={step}>{step.title}</div>
      ))}
    </div>
  );
};

const StepBtn = ({ step, position, number, index }: StepBtnProps) => {
  return (
    <div
      className='absolute '
      style={{
        left: `${Math.round(position)}%`,
        transform: 'translateX(-50%)',
      }}>
      <button className={`bg-slate-50 h-10 w-10 text-xl rounded-full peer `}>
        {index}
      </button>
      <span className='text-xl absolute hidden peer-hover:block peer-hover:bg-slate-900 peer-hover:animate-stepUp top-0 '>
        {step.title}
      </span>
    </div>
  );
};
const ChallengeTimeLine = ({
  challengeSteps,
  startTime,
  endTime,
}: ChallengeTimeLineProps) => {
  const stepsLength = challengeSteps.length
  if (!stepsLength) {
    return <h2>no steps </h2>;
  }
  return (
    <div className='h-[10px] bg-zinc-700 relative my-10 '>
      {challengeSteps.map((step, i) => (
        <StepBtn
          position={(100 / (stepsLength + 1)) * (i + 1)}
          step={step}
          key={step.challengeId}
          index={i}
        />
      ))}
    </div>
  );
};

const ChallengeStepsView = ({
  challengeSteps,
  startTime,
  endTime,
}: ChallengeTimeLineProps) => {
  return (
    <>
      <ChallengeTimeLine
        challengeSteps={challengeSteps}
        startTime={startTime}
        endTime={endTime}
      />
    </>
  );
};

export { ChallengeTimeLine, ChallengeStepsView };
