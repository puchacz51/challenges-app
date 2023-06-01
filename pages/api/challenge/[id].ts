import formidable, { File as FormFile } from 'formidable';
import next, { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  SupabaseClient,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../services/supabase/schema';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: 2000000,
  },
};
let supabaseClient: SupabaseClient<Database>;
const handler: NextApiHandler = async (req, res) => {
  supabaseClient = createServerSupabaseClient({ req, res });
  console.log(22);

  if (req.method === 'DELETE') {
    console.log(req.query.id);
    res.statusCode = 200;
    // cosnt challengeData await =supabaseClient.from('challenges').select('*').eq('id')

    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        status: 'success',
        message: 'Deleted Successfully',
      })
    );
  } else {
    res.statusCode = 405;
    res.setHeader('Allow', ['DELETE']);
    res.end('Method Not Allowed');
  }
};

export default handler;
