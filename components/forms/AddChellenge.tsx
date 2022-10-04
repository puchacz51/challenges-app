import { useMutation, useQueryClient } from 'react-query';
import { string, object, boolean } from 'yup';
import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../inputs/TextInput';
import LongTextInput from '../inputs/LongTextInput';
import CheckBox from '../inputs/CheckBox';
const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  // isPublic: boolean().equals([false, true]),
});

const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 1000,
  endTime: 1000,
  images: [],
};

const addChellenge = async (values) => {
  try {
    console.log('adding....');
    let formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key == 'images') {
        let id = 0;
        for (const image of values.images) {
          formData.append(`image${id++}`, image);
        }
        return;
      }
      formData.append(key, values[key]);
    });
    await axios.post('/api/post', formData, { method: 'POST' });
  } catch (error) {
    throw error;
  }
};

export const AddChellengeForm = () => {
  const methods = useForm({ resolver: yupResolver(privateChellengeschema) });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmitHandler = (data) => {
    console.log(data);
    console.log(errors);
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
