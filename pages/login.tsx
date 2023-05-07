import { GetServerSideProps, NextApiRequest } from 'next';
import LoginOptions from '../components/forms/LoginOptions';
import { store } from '../services/Store/store';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { HeaderLoginForm } from '../components/forms/LoginForm';
import { useState } from 'react';
import { RegisterForm } from '../components/forms/RegisterForm';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, resolvedUrl } = ctx;

  try {
    const supabaseServerClient = createServerSupabaseClient(ctx);
    const {
      data: { session },
      error,
    } = await supabaseServerClient.auth.getSession();
    if (error) throw error;

    if (session) return { redirect: { destination: '/', permanent: true } };
  } catch (err) {}

  return {
    props: {},
  };
};

const LoginPage = () => {
  const [viewType, setViewType] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  return (
    <main className='min-h-full h-full w-full max-w-screen-md text-xl border-2 border-black rounded-md mx-auto '>
      {viewType === 'LOGIN' ? (
        <LoginPageForm setRegisterView={() => setViewType('REGISTER')} />
      ) : (
        <RegisterForm />
      )}
    </main>
  );
};

const LoginPageForm = ({
  setRegisterView,
}: {
  setRegisterView: () => void;
}) => {
  return (
    <div>
      <HeaderLoginForm />
      <button
        className='bg-blue-600 border-4 border-black mx-3 p-3 rounded-2xl my-1 font-semibold'
        onClick={setRegisterView}>
        {' '}
        crate account
      </button>
      <button className='bg-blue-600 border-4 border-black mx-3 p-3 rounded-2xl my-1 font-semibold'>
        {' '}
        forgot password?
      </button>
    </div>
  );
};

export default LoginPage;
