import { FormProvider, useForm } from 'react-hook-form';
import { FormTextInput } from './inputs/TextInput';
import { object, ref, string } from 'yup';
import { supabase } from '../../services/supabase/supabase';
import {
  signInWithEmail,
  signInWithGitHub,
  signUpWithEmail,
} from '../../services/supabase/authOptions';
import { AuthError } from '@supabase/supabase-js';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { BaseSyntheticEvent } from 'react';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';

const initialValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
  name: '',
};
type FormHeaderLogin = {
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
};
const LoginFormPattern = object({
  email: string().email().required(),
  password: string()
    .required()
    .min(6, 'Password must be 6 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter'),
  passwordConfirmation: string()
    .required()
    .oneOf([ref('password'), null], 'Passwords must match'),
  name: string()
    .min(2, 'name must be 2 characters long ')
    .max(15, 'name must not exceed 15 charecters')
    .required(),
});

export const RegisterForm = () => {
  const router = useRouter();
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
  const hadnleLogin = async (
    { email, password }: FormHeaderLogin,
    e: BaseSyntheticEvent<object, any, any>
  ) => {
    e.preventDefault();
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) throw error;
      router.replace('/');
    } catch (err: unknown) {}
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data, e) => {
          hadnleLogin(data, e);
        })}
        className='min-w-max block  bg-white'>
        <div className='px-2'>
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
          <FormTextInput<FormHeaderLogin>
            name='passwordConfirmation'
            text='confirm password'
            errors={errors.passwordConfirmation}
            type='password'
          />
          <FormTextInput<FormHeaderLogin>
            name='name'
            text='name'
            errors={errors.password}
            type='text'
          />
        </div>
        <button
          type='submit'
          className={`border-2 border-black w-full py-2 uppercase font-semibold ${
            !isValid ? 'bg-gray-600' : 'bg-green-600'
          }`}>
          create account
        </button>
        <div className='relative'>
          <div className='mt-2 text-[1.5em] '>
            <button
              type='button'
              className=''
              onClick={() => signInWithGitHub()}>
              <FaGithub />
            </button>
            <button
              type='button'
              className='text-blue-700 '
              onClick={() => signInWithGitHub()}>
              <FaGoogle />
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
