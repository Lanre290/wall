import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that require authentication to view the UI
const protectedRoutes = ['/create', '/my-walls', '/profile'];

export function middleware(request: NextRequest) {
  // We check for the existence of the auth cookie. 
  // (Strict cryptographic verification happens in the Node.js API Route Handlers)
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // 1. If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optionally preserve the route they were trying to visit
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in and trying to access the login page, redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/my-walls', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on these specific routes for performance
  matcher: [
    '/create/:path*', 
    '/my-walls/:path*', 
    '/profile/:path*',
    '/login'
  ],
};
