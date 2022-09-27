import * as React from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const Header = (): JSX.Element => {
  const authInfo = useSelector((state) => state.authInfo);
  const { path } = useSelector((state) => state.page);

  if (path == '/login') {
    return (
      <>
        <header className='fixed  top-0 bg-fuchsia-600 w-full p-2 text-4xl flex items-center justify-around  uppercase'>
          LOGO
        </header>
        <div className='w-full text-transparent p-2 text-4xl '>g</div>
      </>
    );
  }
  return (
    <>
      <header className='fixed  top-0 bg-fuchsia-600 w-full p-2 text-4xl flex items-center justify-around  uppercase'>
        <FaBars />
        <UserProfileBtn authInfo={authInfo} />
      </header>
      <div className='w-full text-transparent p-2 text-4xl '>g</div>
    </>
  );
};

const UserProfileBtn = ({ authInfo }) => {
  return (
    <button className='border-2 border-sky'>
      {authInfo.user?.email ?? <FaUser />}
    </button>
  );
};
export { Header };
