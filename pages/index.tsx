import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useAppSelector } from '../services/Store/store';
import { HeaderLoginForm } from '../components/forms/LoginForm';
import { ChallengeStepForm } from '../types/challengeFormTypes';
import { supabase } from '../services/supabase/supabase';
import axios from 'axios';
import { FormEvent, useRef } from 'react';
import { readFileAsText } from '../components/utilities/challengeFormData';
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { value: 1 } };
};


export default function Home() {
  const { user } = useAppSelector((state) => state.authInfo);
  supabase.storage
    .from('challenges')
    .remove([
      'b8f95be4-d50f-4d91-aa4f-35f790738fb5/0e3e26a9-6dfb-43a2-8909-f0485fd2edb8.jpg',
    ])
    .then((val) => console.log(val));


  // supabase.storage.from('challenges').list();

  return (
    <main>
      <Link href='/myChallenges'>myChallenges</Link>
      <br />
      <Link href={`/${user?.id}`}>myProfile</Link>
      <br />
      <Link href={`/login`}>login page</Link>

    </main>
  );
}
