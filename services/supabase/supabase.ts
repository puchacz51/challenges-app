import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseDB = process.env.NEXT_PUBLIC_DB_URL;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
