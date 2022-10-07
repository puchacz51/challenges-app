import { useMutation, useQueryClient } from 'react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../inputs/TextInput';
import LongTextInput from '../inputs/LongTextInput';
import CheckBox from '../inputs/CheckBox';
import ImagesInput from '../inputs/ImagesInput';
import { privateChellengeschema } from './validateChallenge';
import { supabase } from '../../services/supabase/supabase';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 1000,
  endTime: 1000,
  images: {},
};
interface challenge {
  title: string;
  description: string;
  startTime: any;
  endTime: any;
  images: FileList;
}
export const AddChellengeForm = () => {
  const methods = useForm({
    resolver: yupResolver(privateChellengeschema),
    defaultValues: initialValues,
  });
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, touchedFields },
    getValues,
  } = methods;
  const user = useSelector<RootState>((state) => state.authInfo.user);


  const onSubmitHandler = async (data, userId) => {
    try {
      console.log('addd ...');

      addChallenge(data, userId);
    } catch (err) {
      console.log(err, 2222);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col relative uppercase mx-auto my-8 w-5/6 border-2 border-black pt-5 px-2 '
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
