import { Formik, Form, useFormik } from 'formik';
import { useMutation } from 'react-query/types/react';
import { useSelector } from 'react-redux';
import { string, object, number, boolean, date, SchemaOf } from 'yup';
import { supabase } from '../../services/supabase/supabase';
const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  isPublic: boolean().equals([false, true]),
});

privateChellengeschema._type;
const initialValues = {
  title: '',
  description: '',
  isPublic: false,
  startTime: 0,
  endTime: 0,
};

const addChellenge = async (values) => {
  try {
    const result =await supabase.from('challenges').insert(values);


  } catch (error) {
    console.log(error);
  }
};
export const AddChellengeForm = () => {
  const cos = useMutation(addChellenge,{})
  

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        await privateChellengeschema.validate(values);
        await addChellenge(values);
      } catch (error) {
        console.error(error);
      }
    },
  });
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
        value={formik.values.startTime}
      />
      <label htmlFor='endTime'>End time</label>
      <input
        type='date'
        name='endTime'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.endTime}
      />
      <label htmlFor='isPublic'>Public</label>
      <input type='checkbox' name='isPublic' id='' />

      <button type='submit'>submit</button>
    </form>
  );
};
