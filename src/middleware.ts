import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { verifyJwt } from "@/lib/jwt";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPrivateApiRoute = pathname.startsWith("/api") && !isApiAuthRoute;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Autoriser les routes d'authentification API
  if (isApiAuthRoute) return NextResponse.next();

  // Protection des API privées avec Bearer token
  if (isPrivateApiRoute) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Token manquant", errorCode: "MISSING_TOKEN" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return new NextResponse(
        JSON.stringify({ message: "Token invalide", errorCode: "INVALID_TOKEN" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.next();
  }

  // Auth pour les routes de type page
  const session = await auth();
  const isLoggedIn = !!session;

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
