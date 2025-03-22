import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});

export async function middleware(request: NextRequest) {
  try {
    // Configuration CORS pour les prérequêtes OPTIONS
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // Vérification du rate limiting
    const rateLimitResult = await checkRateLimit(request);
    if (rateLimitResult) return rateLimitResult;

    // Application des headers de sécurité
    const response = NextResponse.next();
    setSecurityHeaders(response);

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function handleCors(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 204 });

  if (origin && process.env.NODE_ENV === 'production') {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

async function checkRateLimit(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') return null;

  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfter = Math.floor((reset - Date.now()) / 1000);
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      },
    });
  }
  return null;
}

function setSecurityHeaders(response: NextResponse) {
  const headers = response.headers;
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // À adapter selon les besoins
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ');

  headers.set('Content-Security-Policy', csp);
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'fullscreen=(self)',
  ].join(', '));
}

export const config = {
  matcher: [
    '/api/:path*', // Protège toutes les routes API
    '/auth/:path*', // Routes d'authentification
  ],
};
