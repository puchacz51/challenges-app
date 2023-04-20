import { supabase } from './supabase';

const getCurrentUrl = () => {
  return `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`;
};

const signInWithEmail = (email: string, password: string) => {
  supabase.auth.signInWithPassword({ email, password });
};
const signUpWithEmail = (email, password) => {
  supabase.auth.signUp({ email, password });
};
const signInWithGitHub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: getCurrentUrl() },
  });
};
export { signInWithEmail, signUpWithEmail, signInWithGitHub };
