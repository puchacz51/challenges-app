import * as React from 'react';

const LoginOptions = (): JSX.Element => {
  return (
    <div className='fixed flex items-center justify-center bg-gray-800 left-9'>
      <h2 className=''></h2>
      <label htmlFor='login'></label>
      <input type='text' name='login' />
      <label htmlFor='password'></label>
      <input type='text' name='password' />
      <button className=''>sign in</button>
    </div>
  );
};

export default LoginOptions;
