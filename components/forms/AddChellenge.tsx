import { useMutation, useQueryClient } from 'react-query';
// import { string, object, boolean, array, mixed } from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../inputs/TextInput';
import LongTextInput from '../inputs/LongTextInput';
import CheckBox from '../inputs/CheckBox';
import ImagesInput from '../inputs/ImagesInput';
import { privateChellengeschema } from './validateChallenge';
import { supabase } from '../../services/supabase/supabase';
import { nanoid } from '@reduxjs/toolkit';
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
  const uploadImage = async (images: FileList, imagesPath: Array<string>) => {
    try {
      let index = 0;
      for (const image of images) {
        await supabase.storage
          .from('challenges')
          .upload(imagesPath[index++], image);
      }
    } catch (err) {
      throw err;
    }
  };
  const addToDB = async (formData) => {
    try {
      supabase.from('challenges').insert(formData);
    } catch (err) {
      throw err;
    }
  };

  const addChallenge = async (values: challenge, userId: string) => {
    try {
      const { images, ...formValues } = values;
      const [imagesPath, imagesName] = Array.from(images).map((image) => {
        const name = nanoid() + '.' + image.type;
        const path = `${userId}/${name}`;
        return [path, name];
      });

      await uploadImage(images, imagesPath);
      await addToDB({...values,imagesName})
      // await
    } catch (err) {}
  };

  const onSubmitHandler = async (data) => {
    addChallenge(data);


  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col relative uppercase mx-auto my-8 w-5/6 border-2 border-black pt-5 px-2 '
        onSubmit={handleSubmit(onSubmitHandler)}>
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
        <CheckBox errors={errors.isPublic} title='is Public'></CheckBox>
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
