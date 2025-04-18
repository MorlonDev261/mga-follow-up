import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import { Buffer } from "buffer";
import {
  DEFAULT_LOGIN_REDIRECT,
  API,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const session = await auth();
  const isLoggedIn = !!session;

  const isApiRoute = pathname.startsWith(API);
  const isApiAuthRoute = apiAuthPrefix.some(prefix => pathname.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const requiresApiAuth = isApiRoute && !isApiAuthRoute;

  // API route non auth et sans session => vérification du token
  if (!isLoggedIn && requiresApiAuth) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Authentification requise", errorCode: "MISSING_TOKEN" }, { status: 401 });
    }

    try {
      const payload = await verifyToken(token);
      // À ce stade, tu peux créer un NextResponse avec un header si besoin
      return NextResponse.next();
    } catch (error) {
      console.error("[API Auth Error]", error);
      return NextResponse.json({ message: "Token invalide", errorCode: "INVALID_TOKEN" }, { status: 401 });
    }
  }

  if (isApiAuthRoute) return NextResponse.next();

  // Routes d'auth : redirige si déjà connecté
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Route protégée, redirige vers login si non connecté
  if (!isLoggedIn && !isPublicRoute) {
    const originalPath = pathname + nextUrl.search;
    const encodedCallbackUrl = Buffer.from(originalPath).toString("base64");

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", encodedCallbackUrl);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
