import * as React from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const Header = (): JSX.Element => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <header className='fixed  top-0 bg-fuchsia-600 w-full p-2 text-4xl flex items-center justify-around  uppercase'>
        <FaBars />
        <UserProfileBtn user={user} />
      </header>
      <div className='w-full text-transparent p-2 text-4xl '>g</div>
    </>
  );
};

const UserProfileBtn = ({ user }) => {
  
  return (
    <button className='border-2 border-sky'>
      {user.user?.email ??  <FaUser />}
    </button>
  );
};
export { Header };
