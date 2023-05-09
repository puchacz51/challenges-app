import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  setIsOpenList,
  setSelectedStep,
} from '../../services/Store/challengesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../../services/Store/store';
import { HiOutlineArrowCircleUp } from 'react-icons/hi';
import { ChallengeStep } from '../utilities/useChallengeQuery';
import { maxNameLength } from '../utilities/maxNameLength';
interface ChallengeTimeLineProps {
  challengeSteps: ChallengeStep[];
  startTime: string;
  endTime: string;
}
interface StepBtnProps {
  step: ChallengeStep;
  index: number;
}
interface StepListProps {
  challengeSteps: ChallengeStep[];
}
interface StepListProps {
  challengeSteps: ChallengeStep[];
}
interface StepListElementProps {
  step: ChallengeStep;
  setIsSelected: () => void;
}

type ProgressBarProps = {
  endPositon: number;
};

const ProgressLine = ({ endPositon }: ProgressBarProps) => {
  return (
    <motion.span
      className='bg-green-200 z-0'
      initial={{ height: '100%', left: 0, top: 0, position: 'absolute' }}
      animate={{
        width: endPositon + '%',
        transition: { duration: 0.5, delay: 0.2 },
      }}></motion.span>
  );
};

const StepBtn = ({ step, index }: StepBtnProps) => {
  const { completed, title, stepId } = step;
  const btnRef = useRef<HTMLButtonElement>(null);
  const selectedStepId = useSelector<RootState>(
    (state) => state.challenges.selectedStepId
  );
  const dispatch = useDispatch();
  const isSelected = selectedStepId == stepId;
  return (
    <div className={`relative w-[17%]`}>
      <button
        ref={btnRef}
        onClick={() => dispatch(setSelectedStep(stepId))}
        className={` w-full aspect-square text-[100%] rounded-full -z-10 border-4 border-black  ${
          completed ? 'bg-green-600' : 'bg-slate-500'
        }
           ${isSelected && 'border-red-600'}
         `}>
        {index}
      </button>
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
    step;
  });
  const [startLabel] = new Date(startTime).toLocaleString().split(',');
  const [endLabel] = endTime
    ? new Date(startTime).toLocaleString().split(',')
    : ['end'];

  const stepBtnContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stepBtnContainerRef.current) {
      if (completedCount) {
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
    <div className='flex justify-between bg-zinc-700  border-y-2 z-10 max-w-full'>
      <span className='left-0 relative top-0 bottom-0 px-2 flex items-center uppercase bg-green-600'>
        start
      </span>

      <div
        ref={stepBtnContainerRef}
        className='flex justify-around w-full  relative'>
        <ProgressLine endPositon={progressLinePosition}></ProgressLine>
        {challengeSteps.map((step, i) => (
          <StepBtn step={step} key={step.stepId} index={i} />
        ))}
      </div>
      <span className='right-0  top-0 bottom-0 px-2 flex items-center uppercase bg-green-600'>
        end
      </span>
    </div>
  );
};

const StepListElement = ({ step }: StepListElementProps) => {
  const animate = useAnimation();
  const [stepDate, stepTime] = step.time
    ? new Date(step.time).toLocaleString().split(',')
    : [null, null];
  useEffect(() => {
    animate.start({
      translateY: '0%',
      transition: {
        duration: 0.4,
        delay: 0.2 * (step.stepId - 1),
      },
      position: 'static',
      scale: 1,
    });
  }, []);
  return (
    <motion.button
      animate={animate}
      initial={{ translateY: '-120%', scale: 1.2 }}
      className={`flex flex-col border-2 border-black min-w-[9ch] `}>
      <h3
        className={`w-full border-2  border-black text-center text-xl 
        ${step.completed ? 'bg-green-600' : 'bg-gray-500'}
        `}>
        {step.stepId} {maxNameLength(step.title, 6)}
      </h3>
      <span className='text-sm w-full text-center'>{stepDate}</span>
    </motion.button>
  );
};
const SelectedListElement = ({ step }: StepListElementProps) => {
  const selectedStepId = useSelector<RootState>(
    (state) => state.challenges.selectedStepId
  );
  console.log(step);

  const animate = useAnimation();
  const [stepDate, stepTime] = step?.time
    ? new Date(step.time).toLocaleString().split(',')
    : [null, null];
  useEffect(() => {
    animate.start({
      translateX: '0%',
      transition: {
        duration: 0.4,
        delay: 0.8,
      },
      position: 'static',
    });
  }, []);
  return (
    <motion.div
      animate={animate}
      initial={{ translateX: '-120%' }}
      className={`flex flex-col border-2 border-yellow-500 w-4/5 `}>
      <h3
        className={`w-full border-2  border-black text-center text-xl
         border-red-600
        ${step.completed ? 'bg-green-600' : 'bg-gray-500'}
        `}>
        {maxNameLength(step.title, 30)}
      </h3>
      <p className='px-2 border-b-2 border-black'>{step.description}</p>

      <span className='text-sm w-full text-center'>{stepDate}</span>
    </motion.div>
  );
};
const ChallengeStepsList = ({ challengeSteps }: StepListProps) => {
  const { listIsOpen, selectedStepId } = useAppSelector(
    (state) => state.challenges
  );
  console.log(challengeSteps);

  const dispatch = useDispatch();
  if (!listIsOpen) return <div></div>;

  return (
    <div>
      <div className='overflow-hidden border-2 border-black py-2 flex flex-wrap gap-2 justify-center '>
        {challengeSteps.map((step) => {
          if (step.stepId === selectedStepId) {
            return <></>;
          }
          return (
            <StepListElement
              key={step.stepId}
              step={step}
              setIsSelected={() => dispatch(setSelectedStep(step.stepId))}
            />
          );
        })}
        <SelectedListElement
          setIsSelected={() => null}
          step={challengeSteps[selectedStepId]}
        />
      </div>
      <button
        type='button'
        onClick={() => dispatch(setIsOpenList(false))}
        className='uppercase content-center w-full text-2xl border-2 border-black'>
        <HiOutlineArrowCircleUp className='inline-block h-full ' />{' '}
      </button>
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
      <ChallengeStepsList challengeSteps={challengeSteps} />
    </>
  );
};

export { ChallengeTimeLine, ChallengeStepsView };
