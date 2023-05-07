import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from 'react-hook-form';
import { SimpleCheckBoxSwitch } from './inputs/CheckBox';
import LongTextInput from './inputs/LongTextInput';
import {FormTextInput} from './inputs/TextInput';
import { TimeInput } from './inputs/TimeInput';
import { FormChallenge } from './AddChellenge';
import { ChallengeStepForm } from './ChallengeSteps';

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
  const { getFieldState, getValues, setValue } = context;
  const error = getFieldState(`challengeSteps.${name}`)?.error as Merge<
    FieldError,
    FieldErrorsImpl<ChallengeStepForm>
  >;

  const [stepWithTime, setStepWithTime] = useState(
    !!getValues(`challengeSteps.${name}.time`)
  );
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value || null;
    const currentSteps = getValues('challengeSteps');
    currentSteps[name].time = currentValue;
    const stepTimeKeys = Object.keys(currentSteps).filter(
      (key) => currentSteps[key].time
    );
    if (!stepTimeKeys.length) {
      return;
    }
    const sortedTimeKeys = stepTimeKeys.sort(
      (keyA, keyB) =>
        Date.parse(currentSteps[keyA].time) -
        Date.parse(currentSteps[keyB].time)
    );
    let tempIndex = 0;
    const newStepsOrder = Object.keys(currentSteps).map((key) =>
      currentSteps[key].time ? sortedTimeKeys[tempIndex++] : key
    );
    setValue('challengStepOrder', newStepsOrder);
  };

  const handleAddTimeBtn = () => {
    if (stepWithTime) {
      setValue(`challengeSteps.${name}.time`, null);
      setStepWithTime(false);
    } else {
      setStepWithTime(true);
    }
  };
  return (
    <div
      className={`w-full my-1 px-2 flex flex-col border-4 ${
        error ? 'border-t-red-600' : 'border-black'
      } ${!selected && 'hidden'} `}>
      <h4 className='mt-1'>step {index + 1} </h4>
      <FormTextInput
        name={`challengeSteps.${name}.title` as keyof FormChallenge}
        errors={error?.title}
        text={'step title'}/>
      <LongTextInput
        errors={error?.description}
        title='desciption'
        name={`challengeSteps.${name}.description`}
      />
      <SimpleCheckBoxSwitch
        checked={stepWithTime}
        name='addTime'
        setValue={() => handleAddTimeBtn()}
      />
      {stepWithTime && (
        <TimeInput
          onChange={handleTimeChange}
          name={`challengeSteps.${name}.time`}
        />
      )}
      <button type='button' className='bg-red-600' onClick={() => remove}>
        X
      </button>
    </div>
  );
};
