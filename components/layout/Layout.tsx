import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { Header } from './Header';

const Layout = ({ children }): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <Header></Header>
      {children}
    </>
  );
};

export default Layout;
