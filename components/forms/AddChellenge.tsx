import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormTextInput } from './inputs/TextInput';
import LongTextInput from './inputs/LongTextInput';
import CheckBox, { SimpleCheckBoxSwitch } from './inputs/CheckBox';
import ImagesInput from './inputs/ImagesInput';
import { challengeSchema } from './validateChallenge';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
import { addChallengeMutation } from '../utilities/usePostQuery';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { MdCancel } from 'react-icons/md';
import { SelectBoxForm } from '../inputs/SelectBox';
import { FormChallenge } from '../../types/challengeFormTypes';
import { ChallengeStepForm } from './ChallengeSteps';
import { CHALLENGECATEGORIES } from '../../types/challengeTypes';
import { createChallengeFormData } from '../utilities/challengeFormData';
import axios from 'axios';
import { TimeInput } from './inputs/TimeInput';

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
  category: null,
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
    resolver: yupResolver(challengeSchema),
    defaultValues: initialData || initialValues,
    mode: 'onTouched',
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = methods;
  console.log(getValues());

  const { endTime } = getValues();
  const user = useSelector<RootState>((state) => state.authInfo.user) as User;
  const { mutate, isSuccess } = addChallengeMutation(reset);
  const [selectedForm, setSelectedForm] = useState<'INFO' | 'STEPS'>('INFO');
  const [withEndTime, setWithEndTime] = useState(false);
  if (isSuccess) cancelForm();
  const onSubmitHandler = async (data: FormChallenge, userId) => {
    try {
      const test = createChallengeFormData(data);
      axios.post('/api/challenge', test, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col relative uppercase mx-auto my-8 w-11/12 border-2 border-black pt-5 text-xl '
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
          <div className='px-3'>
            <FormTextInput name='title' errors={errors.title} text={'title'} />
            <SelectBoxForm
              title='category'
              name='category'
              defaultValue='select category'
              errors={errors.category}
              values={CHALLENGECATEGORIES.map((cat) => cat.replace('-', ' '))}
            />
            <LongTextInput
              name='description'
              errors={errors.description}
              title='description'></LongTextInput>

            <TimeInput name='startTime' title='start' onChange={() => null} />
            <SimpleCheckBoxSwitch
              setValue={() =>
                setValue('endTime', endTime ? null : new Date(0).toUTCString())
              }
              checked={!!endTime}
              name='add end time'
            />
            {!!endTime && (
              <TimeInput name='endTime' onChange={() => null} title='end' />
            )}
            <ImagesInput errors={errors.images} />
            <CheckBox errors={null} name='isPublic' />
          </div>
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
