import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';
import { ChallengeStep } from './ChallengeStep';
import { ChangeStepOrder } from './ChangeStepOrder';

export interface ChallengeStepForm {
  title: string;
  description?: string;
  time: string;
  challengeId?: number;
  stepID?: number;
}
export interface ChallengeStepsForm {
  string: ChallengeStepForm;
}
export type ChallengeSteps = ChallengeStepForm[];

const compareStringDate = (date1: string, date2: string) => {
  return Date.parse(date1) - Date.parse(date2);
};

const challengeOrder = (steps: ChallengeSteps) => {
  // const noTImeSteps = steps.filter(step => !step.time)
  const timeSteps = steps.filter((step) => step.time);
  const sortedTimeSteps = timeSteps.sort((date1, date2) =>
    compareStringDate(date1.time, date2.time)
  );
  const newOrderedSteps = steps.map((step) =>
    step.time ? sortedTimeSteps.shift() : step
  );

  return newOrderedSteps;
};

export const ChallengeStepForm = () => {
  const { getValues } = useFormContext();
  const currentValue = getValues();
  const stepsLength = currentValue?.challengeSteps;
  const [displayMode, setDisplayMode] = useState<'addSteps' | 'changeOrder'>(
    'addSteps'
  );

  return (
    <>
      <div className='mx-auto border-1  my-1  flex justify-around'>
        <button
          type='button'
          className={`p-1 border-2 w-1/3 border-black uppercase ${
            displayMode === 'addSteps' && 'bg-black text-white'
          } `}
          onClick={() => setDisplayMode('addSteps')}>
          add steps
        </button>
        <button
          type='button'
          className={`p-1 border-2 w-1/3 border-black uppercase  ${
            displayMode === 'changeOrder' && 'bg-black text-white'
          } `}
          onClick={() => setDisplayMode('changeOrder')}>
          steps order
        </button>
      </div>
      {displayMode === 'addSteps' && (
        <AddChallengeSteps displayOrder={() => setDisplayMode('changeOrder')} />
      )}
      {displayMode === 'changeOrder' && (
        <ChangeStepOrder displayAddSteps={() => setDisplayMode('addSteps')} />
      )}
    </>
  );
};

export const AddChallengeSteps = ({ displayOrder }) => {
  const [selectedStep, SetSelectedStep] = useState('');
  const context = useFormContext<FormChallenge>();
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
  const { setValue, trigger, getValues } = context;
  const { challengeSteps, challengStepOrder } = getValues();
  const removeStep = (name: string) => {
    const newSteps = challengStepOrder.filter((step) => step != name);
    setValue('challengStepOrder', newSteps);
  };

  const handleAddStep = () => {
    if (challengStepOrder.length < 6) {
      const newStep = `step${Math.floor(Math.random() * 1000)}`;
      const newSteps = [...challengStepOrder, newStep];
      setValue('challengStepOrder', newSteps);
      SetSelectedStep(newStep);
    }
  };

  return (
    <div className='min-h-[50vh] '>
      <div className={`border-2  border-black `}>
        <h3 className='upper w-full text-center bg-black text-white font-bold'>
          steps
        </h3>
        <div className=' border-black flex justify-around p-1'>
          {challengStepOrder?.map((name, index) => (
            <button
              type='button'
              onClick={() => SetSelectedStep(name)}
              key={name + errorsKey[name]}
              className={`shrink-0  text-lg w-7 h-7 mx-1  box-content text-center rounded-full ${
                name === selectedStep && 'border-2 border-black'
              } ${
                errorsKey.includes(name) ? 'bg-red-600' : 'bg-emerald-400 '
              }`}>
              {index + 1}
            </button>
          ))}

          {challengStepOrder?.length < 5 && (
            <div className='w-full flex justify-end '>
              <button
                type='button'
                className='bg-emerald-400 uppercase  px-2 border-2 border-black'
                onClick={handleAddStep}>
                add step
              </button>
            </div>
          )}
        </div>
        <button
          className='mx-auto  w-3/5 bg-blue-500 font-bold uppercase px-2 py-1 rounded-xl '
          type='button'
          onClick={displayOrder}>
          change steps order
        </button>
        <div className='flex flex-col mx-1'>
          {challengStepOrder?.map((name, i) => (
            <ChallengeStep
              selected={name === selectedStep}
              index={i}
              key={name}
              remove={() => removeStep(name)}
              name={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
