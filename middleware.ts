import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});

// Liste des routes publiques
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth', // Routes d'authentification
  '/api/public' // Routes API publiques
];

// Routes qui nécessitent une authentification mais pas de permissions spéciales
const authRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
];

export async function middleware(request: NextRequest) {
  try {
    const { nextUrl } = request;
    const path = nextUrl.pathname;
    const cookies = request.cookies;
    const sessionToken = cookies.get('session-token')?.value;

    // Gérer les pré-requêtes CORS
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // Appliquer le rate limiting (sauf pour les routes publiques)
    if (!publicRoutes.some(route => path.startsWith(route))) {
      const rateLimitResult = await checkRateLimit(request);
      if (rateLimitResult) return rateLimitResult;
    }

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => 
      path === route || path.startsWith(`${route}/`)
    );

    // Vérifier l'authentification
    let isAuthenticated = false;
    if (sessionToken) {
      // Ici vous devriez valider le token avec votre système d'authentification
      // Ceci est un exemple simplifié
      isAuthenticated = true;
    }

    // Rediriger les utilisateurs déjà authentifiés qui essaient d'accéder aux pages de login/signup
    if (isAuthenticated && (path.startsWith('/login') || path.startsWith('/signup'))) {
      const response = NextResponse.redirect(new URL('/', request.url));
      setSecurityHeaders(response);
      return response;
    }

    // Gestion des routes protégées
    if (!isPublicRoute && !isAuthenticated) {
      // Créer l'URL de login avec le redirect
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', encodeURIComponent(path));
      
      const response = NextResponse.redirect(loginUrl);
      setSecurityHeaders(response);
      return response;
    }

    // Appliquer les en-têtes de sécurité
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

  // Set CORS headers conditionally
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
    'Content-Type, Authorization, X-Requested-With'
  );
  response.headers.set('Access-Control-Max-Age', '86400');
  response.headers.set('Vary', 'Origin');

  return response;
}

async function checkRateLimit(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') return null;

  const getClientIp = () => {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      const ips = forwardedFor.split(',');
      return ips[0]?.trim() || '127.0.0.1';
    }
    
    return (
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      '127.0.0.1'
    );
  };

  const ip = getClientIp();
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
    "script-src 'self' 'unsafe-inline'",
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
    'payment=()',
  ].join(', '));
}

export const config = {
  matcher: [
    // Protéger toutes les routes sauf les statiques et publiques
    '/((?!_next/static|_next/image|favicon.ico|login|signup|api/public|api/auth).*)',
  ],
};
