import 'tailwindcss/tailwind.css';
import '../styles/main.css';
import Layout from '../components/layout/Layout';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import { ReactQueryDevtools } from 'react-query/devtools';
import { store } from '../services/Store/store';
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
  hydrate,
} from 'react-query';
import { setCookie, destroyCookie } from 'nookies';

const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  const dispatch = store.dispatch;
  store.dispatch(setCredentials(pageProps.store?.authInfo));
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setCookie(undefined, 'sb-access-token', session.access_token, {
        maxAge: 30 * 24 * 60 * 60,
      });
      setCookie(undefined, 'sb-refresh-token', session.refresh_token, {
        maxAge: 30 * 24 * 60 * 60,
      });
    } else {
      destroyCookie(null, 'sb-access-token');
      destroyCookie(null, 'sb-refresh-token');
    }

    dispatch(
      setCredentials({
        user: session?.user,
        token: session?.access_token,
      })
    );
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
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
