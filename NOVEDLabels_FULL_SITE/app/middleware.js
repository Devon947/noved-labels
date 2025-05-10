import { NextResponse } from 'next/server';

// Add paths that require authentication
const protectedPaths = ['/waitlist', '/dashboard', '/profile'];
// Add paths that should redirect to home if authenticated
const authPaths = ['/login', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token');

  // Check if the path requires authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!sessionToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 