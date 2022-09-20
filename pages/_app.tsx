import 'tailwindcss/tailwind.css';
import Layout from '../components/layout/Layout';
import { useStore } from '../services/Store/store';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
  console.log(22);
  

  return { props: { user, token } };
};

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.inialReduxState);
  const dispatch = store.dispatch;
  useEffect(() => {
    dispatch(setCredentials(pageProps));
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    axios.post('/api/set-auth-cookie', {
      event,
      session,
    });
    dispatch(
      setCredentials({ user: session.user, token: session.access_token })
    );
  });
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
