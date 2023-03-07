import { UniqueIdentifier } from '@dnd-kit/core';
import { ChallengeStepForm } from '../forms/ChallengeSteps';
import { motion, useAnimation, useAnimationControls } from 'framer-motion';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { doo, setSelectedStep } from '../../services/Store/challengesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';

interface ChallengeTimeLineProps {
  challengeSteps: ChallengeStepForm[];
  startTime: string;
  endTime: string;
}
interface StepBtnProps {
  step: ChallengeStepForm;
  index: number;
}
interface StepListProps {
  challengeSteps: ChallengeStepForm[];
}
interface StepListProps {
  challengeSteps: ChallengeStepForm[];
  activeStep: UniqueIdentifier;
}
interface StepListElementProps {
  step: ChallengeStepForm;
}

const StepsList = ({ challengeSteps, activeStep }: StepListProps) => {
  return (
    <div>
      {challengeSteps.map((step) => (
        <div key={step.stepID}>{step.title}</div>
      ))}
    </div>
  );
};
type ProgressBarProps = {
  endPositon: number;
};

const ProgressLine = ({ endPositon }: ProgressBarProps) => {
  const animation = useAnimation();
  useEffect(() => {
    animation.start({
      width: endPositon + '%',
      transition: { duration: 0.5 },
    });
  }, [endPositon]);
  return (
    <motion.span
      className='bg-green-200 z-0'
      initial={{ height: '100%', left: 0, top: 0, position: 'absolute' }}
      animate={animation}></motion.span>
  );
};

const StepInfo = ({ title }: { title: string }) => {
  return (
    <motion.span
      className='-z-10  border-2 w-[150px] border-black py-x text-center'
      initial={{
        left: '50%',
        top: 0,
        position: 'absolute',
        translateX: '-50%',
      }}
      animate={{
        transition: { duration: 0.3 },
        translateY: '-100%',
      }}>
      {title}
    </motion.span>
  );
};
const StepBtn = ({ step, index }: StepBtnProps) => {
  const { completed, title } = step;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [titleIsVisible, settitleIsVisible] = useState(false);
  const { selectedStepId } = useSelector<RootState>(
    (state) => state.challenges
  );
  const dispatch = useDispatch();

  const isSelected = selectedStepId == index;

  useEffect(() => {
    setSelectedStep(3);
    btnRef.current?.addEventListener('mouseover', () =>
      settitleIsVisible(true)
    );
    btnRef.current?.addEventListener('mouseleave', () =>
      settitleIsVisible(false)
    );
    return () => {
      removeEventListener('mouseover', () => settitleIsVisible(true));
      removeEventListener('mouseleave', () => settitleIsVisible(false));
    };
  }, []);
  return (
    <div className={`relative`}>
      <button
        ref={btnRef}
        onClick={() => dispatch(setSelectedStep(index))}
        className={` h-full aspect-square text-xl rounded-full -z-10 border-2 border-black  ${
          completed ? 'bg-green-600' : 'bg-slate-500'
        }
           ${isSelected && 'border-red-600'}
         `}>
        {index}
      </button>
      {titleIsVisible && <StepInfo title={title} />}
    </div>
  );
};
const ChallengeTimeLine = ({
  challengeSteps,
  startTime,
  endTime,
}: ChallengeTimeLineProps) => {
  const stepsLength = challengeSteps.length;
  const [progressLinePosition, setProgressLinePosition] = useState(0);
  let completedCount = 0;
  challengeSteps.forEach((step) => {
    step.completed && completedCount++;
  });
  const stepBtnContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stepBtnContainerRef.current) {
      if (completedCount) {
        const stepBtnContainerWidth = stepBtnContainerRef.current?.offsetWidth;
        const stepWidth = 100 / stepsLength;
        const endPosition = stepWidth / 2 + stepWidth * completedCount;
        setProgressLinePosition(endPosition);
      }
    }
  }, [completedCount, stepsLength]);
  if (!stepsLength) {
    return <h2>no steps </h2>;
  }

  return (
    <div className='h-[50px] flex justify-between bg-zinc-700  my-14 border-y-2 z-10 max-w-full'>
      <span className='left-0 relative top-0 bottom-0 px-2 flex items-center uppercase bg-green-600'>
        Start{' '}
      </span>

      <div
        ref={stepBtnContainerRef}
        className='flex justify-around w-full  relative'>
        <ProgressLine endPositon={progressLinePosition}></ProgressLine>
        {challengeSteps.map((step, i) => (
          <StepBtn step={step} key={step.stepID} index={i} />
        ))}
      </div>
      <span className='right-0  top-0 bottom-0 px-2 flex items-center uppercase bg-green-600'>
        end
      </span>
    </div>
  );
};

const StepListElement = ({ step }: StepListElementProps) => {
  return (
    <div className='grid grid-cols-4 '>
      <h2>{step.title}</h2>
    </div>
  );
};

const ChallengeStepsList = ({ challengeSteps }: StepListProps) => {
  return (
    <div>
      {challengeSteps.map((step) => (
        <div key={step.stepID}></div>
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
