import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// In-memory store for rate limiting
// In production, you should use Redis or a similar distributed cache
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = {
  webhook: 60, // 60 requests per minute for webhooks
  default: 100 // 100 requests per minute for other endpoints
};

export function rateLimit(handler) {
  return async function rateLimitedHandler(request, context) {
    const ip = headers().get('x-forwarded-for') || 'unknown';
    const path = request.nextUrl.pathname;
    const now = Date.now();
    
    // Determine rate limit based on endpoint
    const maxRequests = path.includes('/webhook') ? MAX_REQUESTS.webhook : MAX_REQUESTS.default;
    
    // Get or create rate limit entry
    const key = `${ip}:${path}`;
    const entry = rateLimitStore.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    // Check if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    // Increment request count
    entry.count++;
    rateLimitStore.set(key, entry);
    
    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
          timestamp: new Date().toISOString()
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      );
    }
    
    // Add rate limit headers to response
    const response = await handler(request, context);
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
    
    return response;
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW); 