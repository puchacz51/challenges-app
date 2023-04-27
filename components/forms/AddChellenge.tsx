import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from './inputs/TextInput';
import LongTextInput from './inputs/LongTextInput';
import CheckBox from './inputs/CheckBox';
import ImagesInput from './inputs/ImagesInput';
import { privateChellengeschema } from './validateChallenge';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
import { addChallengeMutation } from '../utilities/usePostQuery';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { MdCancel } from 'react-icons/md';
import { ChallengeStepForm, ChallengeStepsForm } from './ChallengeSteps';
import { UniqueIdentifier } from '@dnd-kit/core';

export interface FormChallenge {
  title: string;
  description: string;
  isPublic: boolean;
  startTime?: any;
  endTime?: any;
  images: FileList | null;
  challengeSteps?: ChallengeStepsForm | null;
  challengStepOrder: UniqueIdentifier[];
  userId: string;
  imagesOrder: { name: string; url: string[] }[] | null;
}
const initialValues: FormChallenge = {
  title: '',
  description: '',
  isPublic: false,
  startTime: new Date().toUTCString(),
  endTime: new Date().toUTCString(),
  images: null,
  imagesOrder: null,
  challengeSteps: null,
  userId: null,
  challengStepOrder: [],
};
export const AddChallenge = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  return (
    <div className='h-min-screen'>
      <button
        className='bg-red-200'
        onClick={() => setIsVisible((isVisible) => !isVisible)}>
        Add new challenge
      </button>
      {isVisible && <ChallengeForm cancelForm={() => setIsVisible(false)} />}
    </div>
  );
};

interface ChallengeFormProps {
  initialData?: FormChallenge;
  cancelForm: Function;
}

const ChallengeForm = ({ initialData, cancelForm }: ChallengeFormProps) => {
  const methods = useForm({
    resolver: yupResolver(privateChellengeschema),
    defaultValues: initialData || initialValues,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const user = useSelector<RootState>((state) => state.authInfo.user) as User;
  const { mutate, isSuccess } = addChallengeMutation(reset);
  const [selectedForm, setSelectedForm] = useState<'INFO' | 'STEPS'>('INFO');
  if (isSuccess) cancelForm();
  const onSubmitHandler = async (data, userId) => {
    try {
      mutate({ ...data, userId });
    } catch (err) {
      console.log(err);
    }
  };

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
            type='button'
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
          <CheckBox errors={null} name='isPublic'></CheckBox>
          <ImagesInput errors={errors.images} />
        </div>
        <div className={`${selectedForm !== 'STEPS' && 'hidden'}`}>
          <ChallengeStepForm />
        </div>
        {isSubmitting ? (
          <h2>adding...</h2>
        ) : (
          <button className='bg-yellow-500 h-12' type='submit'>
            {' '}
            submit
          </button>
        )}

        <button
          type='button'
          className='absolute right-0 top-0 text-4xl text-red-600 bg-white translate-x-1/2 -translate-y-1/2 '
          onClick={() => cancelForm()}>
          <MdCancel />
        </button>
      </form>
    </FormProvider>
  );
};
export default ChallengeForm;
