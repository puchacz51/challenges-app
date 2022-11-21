import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../inputs/TextInput';
import LongTextInput from '../inputs/LongTextInput';
import CheckBox from '../inputs/CheckBox';
import ImagesInput from '../inputs/ImagesInput';
import { privateChellengeschema } from './validateChallenge';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
import { addChallengeMutation } from '../utilities/usePostQuery';
import { useState } from 'react';
import Challenge from '../../pages/challenge/[id]';
import { AddChallengeSteps, ChallengeSteps } from './ChallengeSteps';
const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 1000,
  endTime: 1000,
  images: {},
};
export interface Challenge {
  id?: number;
  title: string;
  description: string;
  startTime?: any;
  endTime?: any;
  images: FileList;
  challengeSteps: ChallengeSteps;
  userId?: string;
}

export const AddChallenge = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  return (
    <div className='h-min-screen'>
      <button
        className='bg-red-200'
        onClick={() => setIsVisible((isVisible) => !isVisible)}>
        Add new challenge
      </button>
      {isVisible && <ChallengeForm />}
    </div>
  );
};

interface ChallengeFormProps {
  initialData?: Challenge;
}

const ChallengeForm = ({ initialData }: ChallengeFormProps) => {
  
  const methods = useForm({
    resolver: yupResolver(privateChellengeschema),
    defaultValues: initialData || initialValues,
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const user = useSelector<RootState>((state) => state.authInfo.user);
  const { mutate, isSuccess } = addChallengeMutation();
  const [selectedForm, setSelectedForm] = useState<'INFO' | 'STEPS'>('INFO');

console.log(errors);

  const onSubmitHandler = async (data, userId) => {
    try {
      mutate({ ...data, userId });
    } catch (err) {}
  };
  if (isSuccess) {
    reset();
  }
  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col relative uppercase mx-auto my-8 w-11/12 border-2 border-black pt-5 px-2 '
        onSubmit={handleSubmit((data) => onSubmitHandler(data, user.id))}>
        <h2 className='absolute text-2xl left-1/2 bg-white font-bold border-4 border-black rounded-xl px-3 -translate-x-1/2 -translate-y-10 z-10 '>
          challenge
        </h2>
        <div className=' my-3 flex justify-around '>
          <button
            onClick={() => setSelectedForm('INFO')}
            className={`uppercase border-2 w-2/5 p-2 border-black  ${
              selectedForm == 'INFO' && 'bg-black text-white'
            }`}>
            Info
          </button>
          <button
            type='button'
            onClick={() => setSelectedForm('STEPS')}
            className={`uppercase border-2 w-2/5 p-2 border-black  ${
              selectedForm == 'STEPS' && 'bg-black text-white'
            }`}>
            steps
          </button>
        </div>

        <div className={`${selectedForm !== 'INFO' && 'hidden'}`}>
          <TextInput
            name='title'
            errors={errors.title}
            text={'title'}></TextInput>
          <LongTextInput
            name='description'
            errors={errors.description}
            title='description'></LongTextInput>
          <CheckBox errors={errors.isPublic} name='isPublic'></CheckBox>
          <ImagesInput errors={errors.images} />
        </div>
        <div className={`${selectedForm !== 'STEPS' && 'hidden'}`}>
          <AddChallengeSteps />
        </div>
        {isSubmitting ? (
          <h2>adding...</h2>
        ) : (
          <button className='bg-yellow-500 h-12' type='submit'>
            {' '}
            submit
          </button>
        )}
      </form>
    </FormProvider>
  );
};
