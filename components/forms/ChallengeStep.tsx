import { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { SimpleCheckBoxSwitch } from "../inputs/CheckBox";
import LongTextInput from "../inputs/LongTextInput";
import TextInput from "../inputs/TextInput";
import { TimeInput } from "../inputs/TimeInput";

interface ChallengeStepProps {
  context: UseFormReturn<FieldValues, any>;
  index: number;
  remove: Function;
  name: string;
  selected: boolean;
}

export const ChallengeStep = ({
  context,
  index,
  remove,
  name,
  selected,
}: ChallengeStepProps) => {
  const { unregister, getFieldState, setValue} = context;
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

      <button type='button' className='bg-red-600' onClick={remove}>
        X
      </button>
    </div>
  );
};
