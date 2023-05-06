import { FormProvider, useForm } from 'react-hook-form';
import { FormTextInput } from './inputs/TextInput';
import { object, string } from 'yup';
import { supabase } from '../../services/supabase/supabase';
import { signInWithEmail } from '../../services/supabase/authOptions';
import { AuthError } from '@supabase/supabase-js';
import { yupResolver } from '@hookform/resolvers/yup';

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
  const methods = useForm({
    mode: 'onTouched',
    defaultValues: initialValues,
    resolver: yupResolver(LoginFormPattern),
  });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = methods;
  const hadnleLogin = async ({ email, password }: FormHeaderLogin) => {
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        setError('email', new Error('invalid email or password'));
      }
      throw err;
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={() =>
          handleSubmit((data, e) => {
            e.preventDefault();
            hadnleLogin(data);
          })
        }>
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
        <button>log in</button>
      </form>
    </FormProvider>
  );
};
