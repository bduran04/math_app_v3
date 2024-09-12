// app/api/auth-change/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  const { event, session } = await request.json();

  // Initialize Supabase client with SSR capabilities
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value || null;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  if (event === 'SIGNED_IN') {
    // Handle user sign in
    if (session) {
      // Update session cookies
      const response = NextResponse.json({ message: 'User signed in' });
      response.cookies.set('supabase-auth-token', session.access_token, {
        httpOnly: true,
        path: '/',
      });
      return response;
    }
  } else if (event === 'SIGNED_OUT') {
    // Handle user sign out
    const response = NextResponse.json({ message: 'User signed out' });
    response.cookies.delete('supabase-auth-token');
    return response;
  }

  return NextResponse.json({ message: 'Auth state change handled' });
}
