import { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useAppSelector } from '../../services/Store/store';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { MdOutlineLogout } from 'react-icons/md';
import { signOut } from '../../services/supabase/authOptions';
import { HeaderLoginForm } from '../forms/LoginForm';
import Link from 'next/link';

const findUserPhoto = (user: User) => {
  const keyIncludedUserPhoto = ['picture', 'avatar_url'];
  const photoKey = Object.keys(user.user_metadata).find((metadataKey) =>
    keyIncludedUserPhoto.includes(metadataKey)
  );
  if (!photoKey) return null;
  const photoUrl = user.user_metadata[photoKey];
  if (!photoUrl) return null;
  return photoUrl;
};
const Header = (): JSX.Element => {
  const authInfo = useAppSelector((state) => state.authInfo);

  return (
    <>
      <header className='fixed top-0 bg-fuchsia-600 w-full  text-4xl flex items-center justify-around  uppercase z-50'>
        <FaBars />
        {authInfo.user ? (
          <UserProfileBtn profileUrl={findUserPhoto(authInfo.user)} />
        ) : (
          <HeaderSignInOptions />
        )}
      </header>
      <div className='w-full text-transparent text-4xl '>wrapper</div>
    </>
  );
};

const UserProfileBtn = ({ profileUrl }: { profileUrl: string }) => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  return (
    <div className='h-10 bg-red-50 flex relative'>
      <button
        className='border-2 border-sky h-10 aspect-square relative'
        onClick={() => setPanelIsOpen((state) => !state)}>
        {profileUrl ? (
          <Image src={profileUrl} alt='profile image' fill />
        ) : (
          <FaUser />
        )}
      </button>
      <div
        className={`absolute top-[100%] left-[50%] translate-x-[-50%] border-2 border-black ${
          !panelIsOpen && 'hidden'
        }`}>
        <button
          className='text-lg bg-red-600 w-max flex items-center gap-1 p-1'
          onClick={signOut}>
          <span>log out</span>
          <MdOutlineLogout />
        </button>
      </div>
    </div>
  );
};
const LoginForm = () => {
  return (
    <div className='text-lg  bg-white '>
      <HeaderLoginForm />
    </div>
  );
};

const HeaderSignInOptions = () => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);
  return (
    <div className='bg-red-50 flex bg-transparent relative h-full'>
      <button
        className='text-lg uppercase font-bold  bg-green-500 p-2 rounded-2xl '
        onClick={() => setPanelIsOpen((state) => !state)}>
        sign in
      </button>
      <Link
        href='/login'
        className='text-sm bg-blue-600 w-24 text-center font-bold border-2 border-black rounded-2xl'>
        create account
      </Link>

      <div
        className={`absolute top-[100%] left-[50%] translate-x-[-50%] border-4 border-black w-[200px] ${
          !panelIsOpen && 'hidden'
        }`}>
        <LoginForm />
      </div>
    </div>
  );
};

export { Header };
