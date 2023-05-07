import { FormProvider, useForm } from 'react-hook-form';
import { FormTextInput } from './inputs/TextInput';
import { object, string } from 'yup';
import { supabase } from '../../services/supabase/supabase';
import {
  signInWithEmail,
  signInWithGitHub,
} from '../../services/supabase/authOptions';
import { AuthError } from '@supabase/supabase-js';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { BaseSyntheticEvent, FormEvent, use, useState } from 'react';
import Link from 'next/link';

const initialValues = {
  email: '',
  password: '',
};
type FormHeaderLogin = {
  email: string;
  password: string;
};
const LoginFormPattern = object({
  email: string().email().required(),
  password: string()
    .required()
    .min(6, 'Password must be 6 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter'),
});

export const HeaderLoginForm = () => {
  return (
    <div>
      <div className='mt-2 flex justify-center gap-3 text-[2em] border-b-2 border-black py-2'>
        <button type='button' className='' onClick={() => signInWithGitHub()}>
          <FaGithub />
        </button>
        <button
          type='button'
          className='text-blue-700 '
          onClick={() => signInWithGitHub()}>
          <FaGoogle />
        </button>
      </div>{' '}
      <LoginForm />
    </div>
  );
};
export const LoginForm = () => {
  const methods = useForm({
    mode: 'onTouched',
    defaultValues: initialValues,
    resolver: yupResolver(LoginFormPattern),
  });
  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setError,
  } = methods;
  const [supabaseError, setSupabaseError] = useState<string>();

  const hadnleLogin = async (
    { email, password }: FormHeaderLogin,
    e: BaseSyntheticEvent<object, any, any>
  ) => {
    e.preventDefault();

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
    } catch (err: unknown) {
      setSupabaseError('invalid email or password');
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data, e) => hadnleLogin(data, e))}
        className='min-w-max block bg-white'>
        <div className='w-[95%] mx-auto'>
          <FormTextInput<FormHeaderLogin>
            name='email'
            text='email'
            errors={errors.email}
          />
          <p> {}</p>
          <FormTextInput<FormHeaderLogin>
            name='password'
            text='password'
            errors={errors.password}
            type='password'
          />
        </div>
        <button
          type='submit'
          className={`border-2 border-black w-full py-2 uppercase font-semibold ${
            !isValid ? 'bg-gray-600' : 'bg-green-600'
          }`}>
          log in
        </button>
      </form>
    </FormProvider>
  );
};
