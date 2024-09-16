import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { deleteCookie } from '../../utils/supabase/cookies';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Failed to logout', error);
    return NextResponse.redirect(new URL('/error', req.url)); // Redirect to an error page if there's an error
  }

  const response = NextResponse.redirect(new URL('/', req.url)); // Redirect to the home page
  deleteCookie(response, 'user-data'); // Delete cookies if needed

  return response;
}
