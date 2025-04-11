import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string) {
            cookieStore.delete(name);
          },
        },
      }
    );
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Get the user after authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user exists, store user data in cookie
    if (user) {
      // Extract name information from Google auth metadata
      const fullName = user.user_metadata.full_name || user.user_metadata.name || '';
      
      // Split the full name into first and last name
      let firstName = '';
      let lastName = '';
      
      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      const userData = {
        id: user.id,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        // Optionally add avatar URL as well
        avatar: user.user_metadata.avatar_url || user.user_metadata.picture || '',
      };
      
      cookieStore.set('user-data', JSON.stringify(userData), { 
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      // Optionally update the user profile in your database
      try {
        await supabase
          .from('profiles')  // Assuming you have a profiles table
          .upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });
      } catch (error) {
        console.error('Error updating profile:', error);
        // Continue with the flow even if profile update fails
      }
    }
  }
  
  // Redirect to the dashboard after successful authentication
  return NextResponse.redirect(new URL('/dashboard', request.url));
}