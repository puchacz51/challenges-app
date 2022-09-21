import { supabase } from './supabase';

const signInWithEmail = (email: string, password: string) => {
  supabase.auth.signIn({ email, password }, { shouldCreateUser: true });
};
const signUpWithEmail = (email, password) => {
  supabase.auth.signUp({ email, password });
};
const signInWithGitHub = () => {
  supabase.auth.signIn({ provider: 'github' });
};
export { signInWithEmail, signUpWithEmail, signInWithGitHub };
