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
import { AddChallengeSteps } from './ChallengeSteps';
const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 1000,
  endTime: 1000,
  images: {},
};
interface Challenge {
  title: string;
  description: string;
  startTime: any;
  endTime: any;
  images: FileList;
  challengeSteps: Challenge[];
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
    formState: { errors, isSubmitting, touchedFields },
  } = methods;

  const user = useSelector<RootState>((state) => state.authInfo.user);
  const { mutate } = addChallengeMutation();

  const onSubmitHandler = async (data, userId) => {
    console.log(data);

    try {
      mutate({ ...data, userId });
    } catch (err) {}
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col relative uppercase mx-auto my-8 w-11/12 border-2 border-black pt-5 px-2 '
        onSubmit={handleSubmit((data) => onSubmitHandler(data, user.id))}>
        <h2 className='absolute text-2xl left-1/2 bg-white font-bold border-4 border-black rounded-xl px-3 -translate-x-1/2 -translate-y-10 z-10 '>
          challenge
        </h2>
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
        <AddChallengeSteps />
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
