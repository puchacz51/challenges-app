import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { setCredentials } from '../services/Store/authSlice';
import { store } from '../services/Store/store';
import { supabase } from '../services/supabase/supabase';

export const getServerSidePropsWrapper =
  (getServerSideProps: GetServerSideProps, protectedRoute = false) =>
  async (ctx: GetServerSidePropsContext) => {
    const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
    if (protectedRoute && !token) {
      return {
        redirect: { destination: '/login', permanent: false },
        props: {},
      };
    }

    store.dispatch(setCredentials({ user, token }));
    let callbackProps = { props: {} } as any;
    if (getServerSideProps) {
      callbackProps = await getServerSideProps(ctx);
    }

    return { props: { store: store.getState(), ...callbackProps } };
  };
