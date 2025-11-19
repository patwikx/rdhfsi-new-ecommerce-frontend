import { auth } from '@/auth';
import { NextResponse } from 'next/server';


export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Debug logging
  console.log('Proxy middleware:', {
    path: nextUrl.pathname,
    isLoggedIn,
    hasAuth: !!req.auth,
    authUser: req.auth?.user?.email
  });

  const isAuthPage = nextUrl.pathname.startsWith('/auth/login') || 
                     nextUrl.pathname.startsWith('/auth/register') ||
                     nextUrl.pathname.startsWith('/login') ||
                     nextUrl.pathname.startsWith('/register');
  
  const isProtectedRoute = nextUrl.pathname.startsWith('/checkout') ||
                          nextUrl.pathname.startsWith('/orders') ||
                          nextUrl.pathname.startsWith('/profile') ||
                          nextUrl.pathname.startsWith('/settings');

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    console.log('Redirecting logged-in user away from auth page');
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // Redirect non-logged-in users to login for protected routes
  if (!isLoggedIn && isProtectedRoute) {
    console.log('Redirecting non-logged-in user to login');
    const redirectUrl = new URL('/auth/login', nextUrl);
    redirectUrl.searchParams.set('redirect', nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
