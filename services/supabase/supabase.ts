import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './schema';
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createBrowserSupabaseClient<Database>({
  supabaseKey: supabaseAnonKey,
  supabaseUrl: supabaseUrl,
});
// export let supabaseServerClient = (supabaseClient) => supabaseClient;
