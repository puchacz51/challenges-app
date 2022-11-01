import 'tailwindcss/tailwind.css';
import '../styles/main.css';
import Layout from '../components/layout/Layout';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import { store } from '../services/Store/store';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import axios from 'axios';
import { ReactQueryDevtools } from 'react-query-devtools';
const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  const dispatch = store.dispatch;
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) return;
    fetch('/api/set-auth-cookie', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    });
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
        <Hydrate state={pageProps.queryState}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  );
};

export default MyApp;
