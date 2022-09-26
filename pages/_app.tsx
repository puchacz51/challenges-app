import 'tailwindcss/tailwind.css';
import Layout from '../components/layout/Layout';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { dispatch, useStore } from '../services/Store/store';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    const { user, access_token, refresh_token } = supabase.auth.session() ?? {
      user: null,
      access_token: null,
    };
    setCookie(null, 'sb-refresh-token', refresh_token);
    setCookie(null, 'sb-access-token', access_token);

    dispatch(setCredentials({ user, access_token, refresh_token }));
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    // axios.post('/api/set-auth-cookie', {
    //   event,
    //   session,
    // });
    if (!session) return;
    dispatch(
      setCredentials({
        user: session?.user,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    );
  });
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default MyApp;
