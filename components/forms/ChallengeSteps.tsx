import { UniqueIdentifier } from '@dnd-kit/core';
import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';
import { ChallengeStep } from './ChallengeStep';
import { ChangeStepOrder } from './ChangeStepOrder';

export type ChallengeStepForm = {
  title: string;
  description?: string;
  time: string;
  challengeId?: number;
  stepId?: number;
  completed?: boolean;
};
export type ChallengeStepsForm = {
  [key: UniqueIdentifier]: ChallengeStepForm;
};
export interface ChallengeSteps {}

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
  const context = useFormContext<FormChallenge>();
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
  const { setValue, getValues } = context;
  const { challengStepOrder } = getValues();
  const [selectedStep, SetSelectedStep] = useState<UniqueIdentifier>(
    challengStepOrder[0] || ''
  );

  const removeStep = (name: UniqueIdentifier) => {
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
                errorsKey.includes(name as string)
                  ? 'bg-red-600'
                  : 'bg-emerald-400 '
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

        <div className='flex flex-col mx-1'>
          {challengStepOrder?.map((name, i) => (
            <ChallengeStep
              selected={name === selectedStep}
              index={i}
              key={name}
              remove={() => removeStep(name)}
              name={name as 'UniqueIdentifier'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
