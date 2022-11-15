import { supabase } from './supabase';

const signInWithEmail = (email: string, password: string) => {
  supabase.auth.signIn({ email, password }, { shouldCreateUser: true });
};
const signUpWithEmail = (email, password) => {
  supabase.auth.signUp({ email, password });
};
const signInWithGitHub = async (
  redirectURL = window.location.href.toString()
) => {
  const user = await supabase.auth.signIn(
    { provider: 'github' }
  );
  
};
export { signInWithEmail, signUpWithEmail, signInWithGitHub };
