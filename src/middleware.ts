import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth(); // Vérification de session correcte
  const isLoggedIn = !!session;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isApiAuthRoute && !isAuthRoute) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Authentification requise", errorCode: "MISSING_TOKEN" }, { status: 401 });
    }

    try {
      // Vérifie le token JWT
      const payload = await verifyToken(token);  // Assure-toi que `verifyToken` est une fonction pour valider le token JWT
      
      req.headers.set("x-user-id", payload.id);
      
      return NextResponse.next();  // Continue si le token est valide
    } catch (error) {
      console.error("[API Auth Error]", error);
      return NextResponse.json({ message: "Token invalide", errorCode: "INVALID_TOKEN" }, { status: 401 });
    }
  }

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

// Exclure les fichiers statiques et dossiers spéciaux du middleware
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
