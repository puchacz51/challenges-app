// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiHandler } from 'next';
import { supabase } from '../../services/supabase/supabase';

const handler: NextApiHandler = (req, res) => {
  const user = supabase.auth.api.getUserByCookie(req);
  if (!user) res.status(300).json({ error: 'user not found' });
  res.status(200).json({ user });
};
export default handler;
