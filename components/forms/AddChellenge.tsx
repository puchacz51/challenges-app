import {
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  UseFormRegister,
} from 'react-hook-form';
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
import { useFormikContext } from 'formik';
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
  challengeSteps: ChallengeStep[];
}
interface ChallengeStep {
  id: number;
  title: string;
  description?: string;
  time: number;
}
interface ChallengeStepProps {
  register: UseFormRegister<FieldValues>;
  index: number;
}

export const AddChallenge = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  return (
    <div className='h-screen'>
      <button
        className='bg-red-200'
        onClick={() => setIsVisible((isVisible) => !isVisible)}>
        Add new challenge
      </button>
      {isVisible && <ChallengeForm />}
    </div>
  );
};

const ChallengeStep = ({ register, index }: ChallengeStepProps) => {
  return (
    <div className='w-full flex flex-col '>
      <button>X</button>
      <TextInput title={`challengestep.${index}.title`} errors={null} text={'step title'}></TextInput>

      <label htmlFor={`challengestep.${index}.title`}>description</label>
      <input type='text' {...register(`challengestep.${index}.title`)} />
    </div>
  );
};

const AddChallengeSteps = () => {
  const [steps, setSteps] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { register } = useFormContext();
  const addChallengeStep = () => {
    if (steps.length < 6) {
      setSteps([...steps, `step${steps.length + 1}`]);
    }
  };

  return (
    <>
      <button onClick={() => setIsVisible((is) => !is)}>add steps</button>
      {isVisible && (
        <div className='flex flex-col bg-slate-500'>
          {steps.map((name, i) => (
            <ChallengeStep register={register} index={i} key={name} />
          ))}
          {steps.length < 5 && <button onClick={addChallengeStep}>o</button>}
        </div>
      )}
    </>
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
    setValue,
    formState: { errors, isSubmitting, touchedFields },
    getValues,
  } = methods;
  const user = useSelector<RootState>((state) => state.authInfo.user);
  const { mutate } = addChallengeMutation();

  const onSubmitHandler = async (data, userId) => {
    try {
      console.log('addd ...');
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
          title='title'
          errors={errors.title}
          text={'title'}></TextInput>
        <LongTextInput
          errors={errors.description}
          title='description'></LongTextInput>
        <CheckBox errors={errors.isPublic} title='isPublic'></CheckBox>
        <AddChallengeSteps />
        <ImagesInput errors={errors.images} />
        {isSubmitting ? (
          <h2>adding...</h2>
        ) : (
          <button className='bg-yellow-500 h-12' type='submit'>
            {' '}
            submit
          </button>
        )}

        {/* {JSON.stringify(getValues())} */}
      </form>
    </FormProvider>
  );
};

// const addChellenge = async (values) => {
//   try {
//     console.log('adding....');
//     let formData = new FormData();
//     console.log(values);

//     Object.keys(values).forEach((key) => {
//       if (key == 'images') {
//         let id = 0;
//         for (const image of values.images) {
//           console.log(image);

//           formData.append(`image${id++}`, image);
//         }
//         return;
//       }
//       formData.append(key, values[key]);
//     });
//     await axios
//       .post('/api/post', formData, { method: 'POST' })
//       .then((w) => console.log(w));
//   } catch (error) {
//     console.log(error);

//     throw error;
//   }
// };
