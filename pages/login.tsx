import { GetServerSideProps, NextApiRequest } from 'next';
import LoginOptions from '../components/forms/LoginOptions';
import { store } from '../services/Store/store';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const supabaseServerClient = createServerSupabaseClient(ctx);
    const {
      data: { session },
      error,
    } = await supabaseServerClient.auth.getSession();
    if (error) throw error;
    if (!session) throw new Error('no session');
    console.log(session);
  } catch (err) {
    console.log(err);
  }

  return {
    props: {},
  };
};

const LoginPage = () => {
  return (
    <main className='min-h-full h-full w-full bg-red-500'>
      <LoginOptions></LoginOptions>
    </main>
  );
};
export default LoginPage;
