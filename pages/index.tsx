import { GetServerSideProps } from 'next';
import { supabase } from '../services/supabase/supabase';
import { store } from '../services/Store/store';
import { setCredentials } from '../services/Store/authSlice';
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
  store.dispatch(setCredentials({ user, token }));
    
  return { props: { user, token } };
};

export default function Home(props) {
  

  return (
    <main>
    </main>
  );
}

