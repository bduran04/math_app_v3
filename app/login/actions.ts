'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
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
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Error signing in:', error.message);
    
    // Handle email not confirmed error differently
    if (error.message === 'Email not confirmed') {
      // Try to confirm the user's email automatically
      console.error('Email not confirmed. Please confirm your email before signing in.');
      throw new Error('Email not confirmed');
    }
    
    throw new Error(error.message);
  }
  
  // Store user data in a cookie for the middleware to use
  if (data.user) {
    const userData = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata.first_name || '',
      lastName: data.user.user_metadata.last_name || '',
    };
    
    cookieStore.set('user-data', JSON.stringify(userData), { 
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  
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
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
  
  if (error) {
    console.error('Error signing up:', error.message);
    throw new Error(error.message);
  }
  
  // For email confirmation flow
  if (data.user && !data.session) {
    // Redirect to a confirmation page
    redirect('/auth/confirm');
  }
  
  // For auto-confirmation (when email verification is disabled)
  if (data.user && data.session) {
    // Store user data in a cookie for the middleware to use
    const userData = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata.first_name || '',
      lastName: data.user.user_metadata.last_name || '',
    };
    
    cookieStore.set('user-data', JSON.stringify(userData), { 
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    redirect('/dashboard');
  }
  
  // Fallback
  return { success: true };
}

export async function logout() {
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
  
  await supabase.auth.signOut();
  
  // Clear user data cookie
  cookieStore.delete('user-data');
  
  redirect('/login');
}