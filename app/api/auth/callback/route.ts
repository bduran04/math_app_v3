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
    
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Extract name from Google auth metadata
      const fullName = user.user_metadata.full_name || user.user_metadata.name || '';
      
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
        avatar: user.user_metadata.avatar_url || user.user_metadata.picture || '',
      };
      
      cookieStore.set('user-data', JSON.stringify(userData), { 
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      // Update the user profile in your database
      try {
        await supabase
          .from('users')  // Match your table name from the screenshot
          .upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }
  
  // This redirect will work in both development and production
  const redirectUrl = new URL('/dashboard', request.url);
  return NextResponse.redirect(redirectUrl);
}