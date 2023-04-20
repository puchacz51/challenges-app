import { NextApiRequest } from 'next';
import { supabase } from '../../services/supabase/supabase';



export const getUserFromRequest = async (req: NextApiRequest) => {
  const refreshToken = req.cookies['sb-refresh-token'];
  const accessToken = req.cookies['sb-access-token'];
  if (refreshToken && accessToken) {
    const cos = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
    console.log(cos,'nowe sprawdzenie');
  } else {
    // make sure you handle this case!
    throw new Error('User is not authenticated.');
  }
  const cos = await supabase.auth.getSession();
  const { data, error } = cos;
  // returns user information
  if (error) {
    throw error;
  }

  return data.session;
};
