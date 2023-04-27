import { NextRequest, NextResponse } from 'next/server';
import { store } from './services/Store/store';
import { setCredentials } from './services/Store/authSlice';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { setSupabaseClient } from './services/Store/supabaseSlice';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const supabaseServer = createMiddlewareSupabaseClient({
    req,
    res,
  });
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session || !session?.user.id) return ;
};
export const config = {
  matcher: ['/myChallenges',  '/challenge/:path*'],
};
