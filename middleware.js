import { NextResponse } from 'next/server';

// Simple in-memory rate limiter
const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;
const ipRequestCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowKey = Math.floor(now / (WINDOW_SIZE_IN_SECONDS * 1000));
  
  const key = `${ip}:${windowKey}`;
  const requestData = ipRequestCounts.get(key) || { count: 0, lastReset: now };
  
  // Reset count if it's a new window
  if (now - requestData.lastReset >= WINDOW_SIZE_IN_SECONDS * 1000) {
    requestData.count = 0;
    requestData.lastReset = now;
  }
  
  // Increment and check
  requestData.count += 1;
  ipRequestCounts.set(key, requestData);
  
  // Clean up old entries (optional - prevents memory leaks)
  if (ipRequestCounts.size > 10000) {
    const oldEntries = [...ipRequestCounts.entries()]
      .filter(([entryKey, data]) => now - data.lastReset >= WINDOW_SIZE_IN_SECONDS * 1000);
    
    for (const [entryKey] of oldEntries) {
      ipRequestCounts.delete(entryKey);
    }
  }
  
  return requestData.count > MAX_REQUESTS_PER_WINDOW;
}

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Get the IP address
  const ip = request.ip ?? '127.0.0.1';
  
  // Rate limiting for API routes
  if (path.startsWith('/api/')) {
    // Check rate limit
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + WINDOW_SIZE_IN_SECONDS).toString(),
        },
      });
    }
    
    // CORS headers for API routes
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
    
    return response;
  }
  
  // Security headers for all responses
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://js.coinbase.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "frame-src 'self' https://js.stripe.com https://pay.coinbase.com; " +
    "connect-src 'self' https://api.stripe.com https://api.coinbase.com https://api.goshippo.com;"
  );
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 