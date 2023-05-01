import * as React from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { RootState, useAppSelector } from '../../services/Store/store';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

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
  const path = useAppSelector((state) => state.page.path);

  return (
    <>
      <header className='fixed  top-0 bg-fuchsia-600 w-full p-2 text-4xl flex items-center justify-around  uppercase z-50'>
        <FaBars />
        {authInfo.user ? (
          <UserProfileBtn profileUrl={findUserPhoto(authInfo.user)} />
        ) : (
          <button>loginin</button>
        )}
      </header>
      <div className='w-full text-transparent p-2 text-4xl '>g</div>
    </>
  );
};

const UserProfileBtn = ({ profileUrl }: { profileUrl: string }) => {
  return (
    <button className='border-2 border-sky h-10 aspect-square relative'>
      {profileUrl ? (
        <Image src={profileUrl} alt='profile image' fill />
      ) : (
        <FaUser />
      )}
    </button>
  );
};
export { Header };
