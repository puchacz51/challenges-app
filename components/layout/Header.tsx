import { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useAppSelector } from '../../services/Store/store';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { MdOutlineLogout } from 'react-icons/md';
import { signOut } from '../../services/supabase/authOptions';

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
      <header className='fixed  top-0 bg-fuchsia-600 w-full p-2 text-4xl flex items-center justify-around  uppercase z-50'>
        <FaBars />
        {authInfo.user ? (
          <UserProfileBtn profileUrl={findUserPhoto(authInfo.user)} />
        ) : (
          <HeaderSignInOptions />
        )}
      </header>
      <div className='w-full text-transparent p-2 text-4xl '>g</div>
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
const headerLoginForm = () => {
  return <div>

  </div>;
};

const HeaderSignInOptions = () => {
  const [panelIsOpen, setPanelIsOpen] = useState(false);

  return (
    <div className='h-10 bg-red-50 flex relative bg-transparent'>
      <button
        className='text-lg uppercase font-bold  bg-green-500 p-2 rounded-2xl '
        onClick={() => setPanelIsOpen((state) => !state)}>
        sign in
      </button>
      <div
        className={`absolute top-[100%] left-[50%] translate-x-[-50%] border-2 border-black ${
          !panelIsOpen && 'hidden'
        }`}>
        <button className='text-lg bg-red-600 w-max flex items-center gap-1 p-1'></button>
      </div>
    </div>
  );
};

export { Header };
