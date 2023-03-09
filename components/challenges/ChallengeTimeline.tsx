import { ChallengeStepForm } from '../forms/ChallengeSteps';
import { motion, useAnimation, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { setSelectedStep } from '../../services/Store/challengesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from 'react-icons/hi';
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
}
interface StepListElementProps {
  step: ChallengeStepForm;
}

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
  const { completed, title, stepID } = step;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [titleIsVisible, settitleIsVisible] = useState(false);
  const selectedStepId = useSelector<RootState>(
    (state) => state.challenges.selectedStepId
  );
  const dispatch = useDispatch();

  const isSelected = selectedStepId == stepID;

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
        onClick={() => dispatch(setSelectedStep(stepID))}
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
    <div className='h-[50px] flex justify-between bg-zinc-700  mt-14 border-y-2 z-10 max-w-full'>
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
  const selectedStepId = useSelector<RootState>(
    (state) => state.challenges.selectedStepId
  );
  const animate = useAnimation();

  useEffect(() => {
    animate.start({
      translateX: '0%',
      transition: { duration: 0.4, delay: 0.2 * (step.stepID - 1) },
      position: 'static',
      scale: 1,
    });
  }, []);

  return (
    <motion.div
      animate={animate}
      initial={{ translateX: '-120%', position: 'absolute', scale: 1.2 }}
      className={`grid  gridStepMobile border-2 border-black my-1 ${
        selectedStepId === step.stepID && 'border-red-700'
      }`}>
      <h3 className='px-2 w-fit '>{step.stepID}</h3>
      <h3 className=''>{step.title}</h3>
      <span>{step.description}</span>
      {step.completed ? 'yes' : 'no'}
    </motion.div>
  );
};

const ChallengeStepsList = ({ challengeSteps }: StepListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen)
    return (
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='uppercase content-center w-full text-2xl border-2 border-black'>
        challenge steps{' '}
        <HiOutlineArrowCircleDown className='inline-block h-full ' />{' '}
      </button>
    );

  return (
    <div>
      <div className='overflow-hidden border-2 border-black px-2  '>
        {challengeSteps.map((step) => (
          <StepListElement key={step.stepID} step={step} />
        ))}
      </div>
      <button
        type='button'
        onClick={() => setIsOpen(false)}
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
