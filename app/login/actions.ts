'use server'

import { headers } from "next/headers";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../utils/supabase/server';
import { deleteCookie } from "../utils/supabase/cookies";
import { NextApiResponse } from "next";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const origin = headers().get("origin");

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string
  }

  // Sign up the user and add metadata
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: data.first_name,
        last_name: data.last_name
      }
    }
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
};

export async function logout(context: { res: NextApiResponse }) {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  // Delete cookies if needed
  deleteCookie(context.res, 'yourCookieName')

  revalidatePath('/', 'layout')
  redirect('/login') // Redirect to the login page or any other page after logout
}