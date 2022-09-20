import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { useGetTimeQuery } from '../services/Store/fakeApi';
import { getUser, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { supabase } from '../services/supabase/supabase';
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);

//   return { props: { user, token } };
// };

export default function Home(props) {
  const { data, isLoading } = useGetTimeQuery('1');
  const all = useGetTimeQuery('2');
  return (
    <main>
      {!isLoading && <Nn />}
    </main>
  );
}

const Nn = () => {
  const user = supabase.auth.user();

  const logIn = () => {
    supabase.auth.signIn({ email: 'bar-sowa@wp.pl', password: 'JAnek1234;' });
  };
  const logOut =()=>{
    supabase.auth.signOut()
  }
  return (
    <>
      <button onClick={logIn}>logIN</button>
      <br />
      <button onClick={logOut}>logOut</button>
    </>
  );
};
