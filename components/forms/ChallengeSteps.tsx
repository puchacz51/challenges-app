import { useEffect, useState } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { SimpleCheckBoxSwitch } from '../inputs/CheckBox';
import LongTextInput from '../inputs/LongTextInput';
import TextInput from '../inputs/TextInput';
import { TimeInput } from '../inputs/TimeInput';

export interface ChallengeStep {
  title: string;
  description?: string;
  time: Date;
  challengeId?: number;
  stepID?: number;
}
export interface ChallengeSteps {
  [key: `step${number}`]: ChallengeStep;
}

interface ChallengeStepProps {
  context: UseFormReturn<FieldValues, any>;
  index: number;
  remove: Function;
  name: string;
  selected: boolean;
}

const ChallengeStep = ({
  context,
  index,
  remove,
  name,
  selected,
}: ChallengeStepProps) => {
  const { unregister, getFieldState, setValue } = context;
  const { error } = getFieldState(`challengeSteps.${name}`);
  const [stepWithTime, setStepWithTime] = useState(false);
  
  if (!stepWithTime) {
    setValue(`challengeSteps.${name}.time`, null);
  }
  useEffect(() => {
    return () => unregister(`challengeSteps.${name}.title`);
  }, []);
  return (
    <div
      className={`w-full my-1 px-2 flex flex-col border-4 ${
        error ? 'border-t-red-600' : 'border-black'
      } ${!selected && 'hidden'} `}>
      <h4 className='mt-1'>step {index + 1} </h4>
      <TextInput
        name={`challengeSteps.${name}.title`}
        errors={error?.title}
        text={'step title'}></TextInput>
      <LongTextInput
        errors={error?.description}
        title='desciption'
        name={`challengeSteps.${name}.description`}
      />
      <SimpleCheckBoxSwitch
        name='addTime'
        setValue={() => setStepWithTime((value) => !value)}
      />
      {stepWithTime && <TimeInput name={`challengeSteps.${name}.time`} />}

      <button className='bg-red-600' type='button' onClick={remove}>
        X
      </button>
    </div>
  );
};

export const AddChallengeSteps = () => {
  const [steps, setSteps] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedStep, SetSelectedStep] = useState('');
  const context = useFormContext();
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
  const stepsValues = context.getValues().challengeSteps;
  const removeStep = (name: string) => {
    const newSteps = steps.filter((step) => step != name);
    setSteps(newSteps);
  };
  const handleAddStep = () => {
    setSteps(['step1']);
    SetSelectedStep('step1');
  };
  const handleAddAnotherStep = () => {
    if (steps.length < 6) {
      const newStep = `step${Math.floor(Math.random() * 1000)}`;
      const newSteps = [...steps, newStep];
      setSteps(newSteps);
      SetSelectedStep(newStep);
    }
  };
  const sortStepsByDate = () => {
    const newStepsOrder = steps.sort(
      (a, b) => stepsValues[a]?.time < stepsValues[b]?.time
    );
  };
  sortStepsByDate();
  if (steps.length === 0) {
    return (
      <div className='min-h-[50vh] flex justify-center items-center'>
        <button
          type='button'
          className='bg-emerald-600 p-2 rounded-xl  '
          onClick={handleAddStep}>
          AddChallenge
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-[50vh] '>
      <button
        className={`w-full ${
          isVisible ? 'bg-cyan-500' : 'bg-emerald-600 p-0  mt-2'
        } min-h-1/2`}
        type='button'
        onClick={() => setIsVisible((is) => !is)}>
        {isVisible ? 'hide' : 'open steps'}
      </button>
      <div className={`border-2  border-black ${!isVisible && 'hidden'}`}>
        <h3 className='upper w-full text-center bg-black text-white font-bold'>
          steps
        </h3>
        <div className=' border-black flex justify-around p-1'>
          {steps.map((name, index) => (
            <button
              type='button'
              onClick={() => SetSelectedStep(name)}
              key={name + errorsKey[name]}
              className={`shrink-0  text-lg w-7 h-7 mx-1 text-center rounded-full ${
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
                onClick={handleAddAnotherStep}>
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
