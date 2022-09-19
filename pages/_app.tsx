import 'tailwindcss/tailwind.css';
import Layout from '../components/layout/Layout';
import { useStore } from '../services/Store/store';
import { Provider, useDispatch } from 'react-redux';
import { supabase } from '../services/supabase/supabase';
import { setCredentials } from '../services/Store/authSlice';
import axios from 'axios';
function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.inialReduxState);
  const dispatch = store.dispatch;

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
        {JSON.stringify(pageProps)} <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
