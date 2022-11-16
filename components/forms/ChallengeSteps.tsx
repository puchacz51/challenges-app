import { useEffect, useState } from 'react';
import {
  FieldValues,
  useFormContext,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form';
import { array } from 'yup';
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
    <div className={`w-full my-1 px-2 flex flex-col border-4 border-black {} `}>
      <h4 className='mt-1'>step {index + 1} </h4>
      <TextInput
        title={`challengestep.${name}.title`}
        errors={null}
        text={'step title'}></TextInput>
      <label htmlFor={`challengestep.${name}.title`}>description</label>
      <input type='text' {...register(`challengestep.${name}.description`)} />
      <TimeInput title={`challengestep.${name}.time`} />
      <button className='bg-red-600' onClick={remove}>
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
  const handleAddStep = () => {
    setSteps(['step1']);
    SetSelectedStep('step1');
  };
const handleAddAnotherStep = ()=>{

  
}

  if (steps.length === 0) {
    return (
      <button className='bg-emerald-600 p-0' onClick={handleAddStep}>
        AddChallenge
      </button>
    );
  }

  return (
    <>
      <button
        className={`w-full ${
          isVisible ? 'bg-cyan-500' : 'bg-emerald-600 p-0  mt-2'
        }`}
        onClick={() => setIsVisible((is) => !is)}>
        {isVisible ? 'hide' : 'open steps'}
      </button>
      <div className={`border-2  border-black ${!isVisible && 'hidden'}`}>
        <h3 className='upper w-full text-center bg-black text-white font-bold'>
          steps
        </h3>
        <div className=' border-black flex p-1'>
          {steps.map((name, index) => (
            <button
            onClick={()=>SetSelectedStep(name)}
              key={name}
              className={`bg-emerald-400  text-lg w-7 h-7 mx-1 text-center  rounded-full ${
                name === selectedStep && 'border-2 border-black'
              }`}>
              {index}
            </button>
          ))}
        </div>

        <div className='flex flex-col mx-1'>
          {steps
            .filter((v) => selectedStep === v)
            .map((name, i) => (
              <ChallengeStep
                context={context}
                index={i}
                key={name}
                remove={() => removeStep(name)}
                name={name}
              />
            ))}
        </div>
        {steps.length < 5 && (
          <button
            className='bg-emerald-400 w-full border-2 border-black'
            onClick={addChallengeStep}>
            o
          </button>
        )}
      </div>
    </>
  );
};
