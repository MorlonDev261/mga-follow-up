import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  let isLoggedIn = false;

  try {
    const session = await auth();
    isLoggedIn = !!session;
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return NextResponse.redirect(new URL("/auth-error", nextUrl));
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route => {
    if (route === "/") return nextUrl.pathname === "/";
    return nextUrl.pathname.startsWith(route);
  });

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    return isLoggedIn 
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = new URL("/login", nextUrl);
    if (callbackUrl) redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  if (!isPublicRoute && !isAuthRoute) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
