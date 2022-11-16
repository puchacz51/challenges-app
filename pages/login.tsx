import { GetServerSideProps } from 'next';
import LoginOptions from '../components/forms/LoginOptions';
import { store } from '../services/Store/store';
import { supabase } from '../services/supabase/supabase';
export const getServerSideProps: GetServerSideProps = async ({
  req,
  resolvedUrl,
}) => {
  const user = await supabase.auth.api.getUserByCookie(req);

  return {
    props: {
      store: store.getState(),
    },
  };
};

const LoginPage = (): JSX.Element => {
  return (
    <main className='min-h-full h-full w-full bg-red-500'>
      <LoginOptions></LoginOptions>
    </main>
  );
};
export default LoginPage;
