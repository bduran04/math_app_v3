import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
  // Update the session
  const res = await updateSession(req);
  
  // Check the route
  const { pathname } = req.nextUrl;
  
  // Get user data from the cookie
  const userData = req.cookies.get('user-data')?.value;
  const isAuthenticated = !!userData;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/study-guide', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Auth routes (login/register)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users away from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};