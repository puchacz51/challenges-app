import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { Database } from './schema';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createBrowserSupabaseClient<Database>({
  supabaseKey: supabaseAnonKey,
  supabaseUrl: supabaseUrl,
});
// export let supabaseServerClient = (supabaseClient) => supabaseClient;
