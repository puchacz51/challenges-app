import * as React from 'react';
import { Header } from './Header';

const Layout = ({ children }): JSX.Element => {
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
};

export default Layout;
