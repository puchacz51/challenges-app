import { Formik, Form, useFormik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { string, object, boolean, mixed } from 'yup';
import { supabase } from '../../services/supabase/supabase';
import Image from 'next/image';
const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  isPublic: boolean().equals([false, true]),
  images: mixed().required(),
});

privateChellengeschema._type;
const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 1000,
  endTime: 1000,
  images: [],
};
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const addChellenge = async (values) => {
  try {
    console.log('adding....');
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      console.log(key);
      
      formData.append(key, values[key]);
    });
    console.log(formData);
    
    await timeout(2000);
    throw new Error('bad ');
  } catch (error) {
    throw error;
  }
};
export const AddChellengeForm = () => {
  const client = useQueryClient();

  const { mutate, isLoading } = useMutation(addChellenge, {
    onMutate: async (newChallenge) => {
      client.cancelQueries(['myChallenges']);
      const previousData = client.getQueryData(['myChallenges']);
      client.setQueryData('myChallenges', (old) => [...old, newChallenge]);
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      client.setQueryData(['myChallenges'], context.previousData);
    },
    onSettled: () => {
      client.invalidateQueries(['myChallenges']);
    },
  });

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        await privateChellengeschema.validate(values);
        mutate(values);
      } catch (error) {
        console.error(error);
      }
    },
  });
  console.log(formik.values.images);

  return (
    <form action='' className='flex flex-col' onSubmit={formik.handleSubmit}>
      <h2 className='text-xl bold font-semibold'>Add new chellenge</h2>
      <label htmlFor='title'>title</label>
      <input
        type='text'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.title}
        name='title'
        className='border-2'
      />
      <label htmlFor='description'>description</label>
      <textarea
        name='description'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}></textarea>
      <label htmlFor='startTime'>Start time</label>
      <input
        type='date'
        name='startTime'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={new Date(formik.values.startTime).toISOString().split('T')[0]}
      />
      <label htmlFor='endTime'>End time</label>
      <input
        type='date'
        name='endTime'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={new Date(formik.values.endTime).toISOString().split('T')[0]}
      />
      <ImagesUplouder formik={formik} />
      <label htmlFor='isPublic'>Public</label>
      <input type='checkbox' name='isPublic' />

      {isLoading ? (
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

const HandleImages = (
  e: ChangeEvent<HTMLInputElement>,
  formHandler,
  setUrls
) => {
  const { files } = e.currentTarget;
  if (!files.length) return;
  const filesUrl = Array.from(files).map((file) => URL.createObjectURL(file));
  setUrls(filesUrl);
  formHandler(files);
};

const ImagesUplouder = ({ formik }) => {
  const [localImagesUrl, setLocalImagesUrl] = useState(['']);

  return (
    <>
      <label htmlFor='image'>add image</label>
      <input
        type='file'
        accept='images/png, images/jpeg'
        multiple={true}
        onChange={(e) =>
          HandleImages(
            e,
            (value) => formik.setFieldValue('images', value),
            setLocalImagesUrl
          )
        }
        name='images'
      />
      {localImagesUrl.map((imageUrl) => (
        <Image width='100' height='100' key={imageUrl} src={imageUrl} />
      ))}
    </>
  );
};
