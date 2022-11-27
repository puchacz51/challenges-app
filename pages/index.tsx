import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '../services/supabase/supabase';
import { store } from '../services/Store/store';
import { setCredentials } from '../services/Store/authSlice';
import { getServerSidePropsWrapper } from '../components/getServerSidePropsWrapper';
import { useQuery } from 'react-query';
const cos: GetServerSideProps = async (ctx) => {
  return { props: { value: 1 } };
};

export const getServerSideProps = getServerSidePropsWrapper(cos);

export default function Home(props) {

  return <main></main>;
}
