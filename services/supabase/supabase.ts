import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    lifetime: 100000,
    path: '/',
    sameSite: 'lax',
    domain: process.env.NEXT_PUBLIC_IP_ADRESS,
  },
  persistSession: false,
});
