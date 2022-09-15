import { NextPage } from 'next';
import LoginOptions from '../components/forms/loginOptions';

const LoginPage = (): JSX.Element => {
  return (
    <main className='min-h-screen'>
      <LoginOptions></LoginOptions>
    </main>
  );
};
export default LoginPage;
