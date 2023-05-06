import { supabase } from './supabase';

const getCurrentUrl = () => {
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`;
};

const signInWithEmail = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};
const signUpWithEmail = (email, password) => {
  return supabase.auth.signUp({ email, password });
};
const signInWithGitHub = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: getCurrentUrl() },
  });
};
const signOut = async () => {
  await supabase.auth.signOut();
};

export { signInWithEmail, signUpWithEmail, signInWithGitHub, signOut };
