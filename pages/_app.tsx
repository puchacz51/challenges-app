import 'tailwindcss/tailwind.css';
import '../styles/main.css';
import Layout from '../components/layout/Layout';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import { ReactQueryDevtools } from 'react-query/devtools';
import { store } from '../services/Store/store';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  const dispatch = store.dispatch;
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(session);
    if (!session) return;
    fetch(`/api/set-auth-cookie`, {
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
