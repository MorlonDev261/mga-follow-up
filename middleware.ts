import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // ✅ Autoriser les routes API d'authentification
  if (isApiAuthRoute) {
    return;
  }

  // ✅ Autoriser les routes publiques
  if (isPublicRoute) {
    return;
  }

  // ✅ Rediriger les utilisateurs connectés depuis les pages de login
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // ✅ Bloquer l'accès aux pages privées si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Exclut _next et les fichiers statiques
    "/api/:path*", // Protège toutes les routes API
  ],
};
