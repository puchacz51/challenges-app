import { GetServerSideProps } from 'next';
import LoginOptions from '../components/forms/LoginOptions';
import { supabase } from '../services/supabase/supabase';
export const getServerSideProps:GetServerSideProps = async ({req,resolvedUrl})=>{
  const user =await supabase.auth.api.getUserByCookie(req)
  
//   if(!user)
// {
//   return{props:{},redirect:{destination}}

// }
  
  // const destination = req. 
return {props:{}}
}


const LoginPage = (): JSX.Element => {
 

  return <main className='min-h-full h-full w-full bg-red-500'>
    <LoginOptions></LoginOptions>
  

  </main>;
};
export default LoginPage;
