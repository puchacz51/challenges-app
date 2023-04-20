import Link from 'next/link';
import * as React from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  signInWithEmail,
  signInWithGitHub,
} from '../../services/supabase/authOptions';

const LoginOptions = (): JSX.Element => {
  return (
    <div className=' flex flex-col flex-nowrap  items-center justify-center bg-gray-800  '>
      <h2 className='text-xl uppercase'>log in with email</h2>
      <label htmlFor='email'></label>
      <input type='text' name='email' className='m-2 rounded-md text-lg' />
      <label htmlFor='password'></label>
      <input type='text' name='password' />
      <button
        className=''
        onClick={() => signInWithEmail('bar-sowo@wp.pl', 'Puchacz1')}>
        sign in
      </button>
      <h2 className=''>other options</h2>

      <button onClick={() => signInWithGitHub()}>
        <FaGithub />
      </button>
      <Link href='/register'>
        register
      </Link>
    </div>
  );
};

export default LoginOptions;
