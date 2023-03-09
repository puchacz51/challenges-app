import { UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';
import {
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { SimpleCheckBoxSwitch } from '../inputs/CheckBox';
import LongTextInput from '../inputs/LongTextInput';
import TextInput from '../inputs/TextInput';
import { TimeInput } from '../inputs/TimeInput';
import { FormChallenge } from './AddChellenge';
import { ChallengeStepsForm, ChallengeStepForm } from './ChallengeSteps';

interface ChallengeStepProps {
  index: number;
  remove: Function;
  name: keyof FormChallenge['challengeSteps'];
  selected: boolean;
}

export const ChallengeStep = ({
  index,
  remove,
  name,
  selected,
}: ChallengeStepProps) => {
  const context = useFormContext<FormChallenge>();
  const { getFieldState, getValues, formState } = context;

  const error = getFieldState(`challengeSteps.${name}`)?.error as Merge<
    FieldError,
    FieldErrorsImpl<ChallengeStepForm>
  >;
  // console.log(cos);

  // const error = formState.errors?.challengeSteps?.name;
  const [stepWithTime, setStepWithTime] = useState(
    !!getValues(`challengeSteps.${name}.time`)
  );
  const handleTimeChange = () => {};
  console.log(stepWithTime);

  return (
    <div
      className={`w-full my-1 px-2 flex flex-col border-4 ${
        error ? 'border-t-red-600' : 'border-black'
      } ${!selected && 'hidden'} `}>
      <h4 className='mt-1'>step {index + 1} </h4>
      <TextInput
        name={`challengeSteps.${name}.title` as keyof FormChallenge}
        errors={error?.title}
        text={'step title'}></TextInput>
      <LongTextInput
        errors={error?.description}
        title='desciption'
        name={`challengeSteps.${name}.description`}
      />
      <SimpleCheckBoxSwitch
        checked={stepWithTime}
        name='addTime'
        setValue={() => setStepWithTime((state) => !state)}
      />
      {stepWithTime && (
        <TimeInput
          onChange={handleTimeChange as any}
          name={`challengeSteps.${name}.time`}
        />
      )}

      <button type='button' className='bg-red-600' onClick={() => remove}>
        X
      </button>
    </div>
  );
};

function sortTimeSteps(challengeSteps: ChallengeStepsForm) {}
