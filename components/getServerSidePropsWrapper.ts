import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
} from 'next';
import { QueryClient } from 'react-query';
import { setCredentials } from '../services/Store/authSlice';
import { store } from '../services/Store/store';
import { supabase } from '../services/supabase/supabase';
import { getUserFromRequest } from './utilities/getUserFromRequest';

export const getServerSidePropsWrapper =
  (getServerSideProps: GetServerSideProps, protectedRoute = false) =>
  async (ctx: GetServerSidePropsContext) => {
    try {
      const { user, access_token: token } = await getUserFromRequest(
        ctx.req as NextApiRequest
      );

      if (protectedRoute && !token) {
        throw new Error('now access token ');
      }

      store.dispatch(setCredentials({ user, token }));
      let callbackProps = { props: {} } as any;
      if (getServerSideProps) {
        callbackProps = await getServerSideProps(ctx);
      }
      return { props: { store: store.getState(), ...callbackProps } };
    } catch (err) {
      return {
        redirect: { destination: '/login', permanent: false },
        props: {},
      };
    }
  };
