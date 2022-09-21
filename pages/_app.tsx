import 'tailwindcss/tailwind.css';
import Layout from '../components/layout/Layout';
import { useStore } from '../services/Store/store';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { setPath } from '../services/Store/pageSlice';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.inialReduxState);
  const dispatch = store.dispatch;
  const router = useRouter();
  useEffect(() => {
    const { user, access_token: token } = supabase.auth.session() ?? {
      user: null,
      access_token: null,
    };

    dispatch(setCredentials({ user, token }));
    dispatch(setPath(router.pathname));
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    axios.post('/api/set-auth-cookie', {
      event,
      session,
    });
    dispatch(
      setCredentials({ user: session?.user, token: session?.access_token })
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
