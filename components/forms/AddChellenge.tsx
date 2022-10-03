import { Formik, Form, useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { string, object, boolean } from 'yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../inputs/TextInput';
const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  isPublic: boolean().equals([false, true]),
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});
  const onSubmitHandler = (data) => {
    console.log(data);
    console.log(errors);
  };
  return (
    <form className='flex flex-col mx-auto my-2 w-4/5 border-2 border-black p-1 ' onSubmit={handleSubmit(onSubmitHandler)}>
      <TextInput
        register={register('title')}
        text={'title'}
        ></TextInput>

      {isSubmitting ? (
        <h2>adding...</h2>
      ) : (
        <button className='bg-yellow-500 h-12' type='submit'>
          {' '}
          submit
        </button>
      )}
    </form>
  );
};
