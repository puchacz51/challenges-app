import { NextApiHandler } from 'next';
import { supabase } from '../../services/supabase/supabase';

const handler: NextApiHandler = async (req, res) => {
  await supabase.auth.api.setAuthCookie(req, res);
};
export default handler;
