import { useEffect, useState } from 'react';
import {
  FieldValues,
  useFormContext,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form';
import TextInput from '../inputs/TextInput';
import { TimeInput } from '../inputs/TimeInput';

export interface ChallengeStep {
  id: number;
  title: string;
  description?: string;
  time: number;
}
interface ChallengeStepProps {
  context: UseFormReturn<FieldValues, any>;
  index: number;
  remove: Function;
  name: string;
}

const ChallengeStep = ({
  context,
  index,
  remove,
  name,
}: ChallengeStepProps) => {
  const { register, unregister } = context;

  useEffect(() => {
    return () => unregister(`challengestep.${name}.title`);
  }, []);
  return (
    <div className='w-full my-1 p-2 flex flex-col border-4 border-black '>
      <h4>step {index + 1} </h4>
      <TextInput
        title={`challengestep.${name}.title`}
        errors={null}
        text={'step title'}></TextInput>
      <label htmlFor={`challengestep.${name}.title`}>description</label>
      <input type='text' {...register(`challengestep.${name}.description`)} />
      <TimeInput title={`challengestep.${name}.time`} />
      <button onClick={remove}>X</button>
    </div>
  );
};

export const AddChallengeSteps = () => {
  const [steps, setSteps] = useState(['step1']);
  const [isVisible, setIsVisible] = useState(false);
  const context = useFormContext();
  console.log(context.getValues());
  
  const addChallengeStep = () => {
    if (steps.length < 6) {
      const newSteps = [...steps, `step${Math.random()}`];
      setSteps(newSteps);
    }
  };
  const removeStep = (name: string) => {
    const newSteps = steps.filter((step) => step != name);
    setSteps(newSteps);
  };

  return (
    <>
      <button onClick={() => setIsVisible((is) => !is)}>add steps</button>
      {isVisible && (
        <div className='flex flex-col'>
          {steps.reverse().map((name, i) => (
            <ChallengeStep
              context={context}
              index={i}
              key={name}
              remove={() => removeStep(name)}
              name={name}
            />
          ))}
          {steps.length < 5 && <button onClick={addChallengeStep}>o</button>}
        </div>
      )}
    </>
  );
};
