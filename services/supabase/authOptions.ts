import { supabase } from './supabase';

const signInWithEmail = (email: string, password: string) => {
  supabase.auth.signIn({ email, password }, { shouldCreateUser: true });
};
const signUpWithEmail = (email, password) => {
  supabase.auth.signUp({ email, password });
};
const signInWithGitHub = (
  redirectURL = window.location.href.toString()
) => {
  supabase.auth.signIn({ provider: 'github' }, { redirectTo: redirectURL });
};
export { signInWithEmail, signUpWithEmail, signInWithGitHub };