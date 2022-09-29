import 'tailwindcss/tailwind.css';
import Layout from '../components/layout/Layout';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import { store } from '../services/Store/store';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  const dispatch = store.dispatch;
  useEffect(() => {
    const { user, access_token, refresh_token } = supabase.auth.session() ?? {
      user: null,
      access_token: null,
    };
    setCookie(null, 'sb-refresh-token', refresh_token);
    setCookie(null, 'sb-access-token', access_token);

    dispatch(setCredentials({ user, token: access_token }));
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) return;
    dispatch(
      setCredentials({
        user: session?.user,
        token: session.access_token,
      })
    );
  });
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </Provider>
  );
};

export default MyApp;
