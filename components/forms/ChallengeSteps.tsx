import { useEffect, useState } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { SimpleCheckBoxSwitch } from '../inputs/CheckBox';
import LongTextInput from '../inputs/LongTextInput';
import TextInput from '../inputs/TextInput';
import { TimeInput } from '../inputs/TimeInput';
import { ChallengeStep } from './ChallengeStep';

export interface ChallengeStepForm {
  title: string;
  description?: string;
  time: string;
  challengeId?: number;
  stepID?: number;
}
export interface ChallengeStepsForm {
  [key: `step${number}`]: ChallengeStepForm;
}
export type ChallengeSteps = ChallengeStepForm[];

export const AddChallengeSteps = () => {
  const [steps, setSteps] = useState([]);
  const [selectedStep, SetSelectedStep] = useState('');
  const context = useFormContext();
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
  const { setValue, trigger } = context;
  const stepsValues = context.getValues().challengeSteps;
  const removeStep = (name: string) => {
    const newSteps = steps.filter((step) => step != name);
    setSteps(newSteps);
  };

  const handleInitialSteps = () => {
    handleAddStep();
    trigger();
  };
  const handleAddStep = () => {
    if (steps.length < 6) {
      const newStep = `step${Math.floor(Math.random() * 1000)}`;
      const newSteps = [...steps, newStep];
      setSteps(newSteps);
      SetSelectedStep(newStep);
    }
  };
  const sortStepsByDate = () => {
    try {
      const stepsTime = steps.filter((step) => step.time != null);

      const newStepsTime = stepsTime.sort((a, b) => {
        return (
          Date.parse(stepsValues[a]?.time) - Date.parse(stepsValues[b]?.time)
        );
      });
      const newStepsOrder = steps.map((step) => {
        if (!step.time) return step;
        else return newStepsTime.shift();
      });

      setSteps(newStepsOrder);
    } catch (err) {
      console.log(err);
    }
  };

  if (steps.length === 0)
    return <InitialStepsBtn handleInitialSteps={handleInitialSteps} />;
  return (
    <div className='min-h-[50vh] '>
      <div className={`border-2  border-black `}>
        <h3 className='upper w-full text-center bg-black text-white font-bold'>
          steps
        </h3>
        <div className=' border-black flex justify-around p-1'>
          {steps.map((name, index) => (
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

          {steps.length < 5 && (
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
          {steps.map((name, i) => (
            <ChallengeStep
              selected={name === selectedStep}
              context={context}
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

const InitialStepsBtn = ({ handleInitialSteps }) => {
  return (
    <div className='min-h-[50vh] flex justify-center items-center'>
      <button
        type='button'
        className='bg-emerald-600  p-2 rounded-xl  '
        onClick={handleInitialSteps}>
        AddChallenge
      </button>
    </div>
  );
};
