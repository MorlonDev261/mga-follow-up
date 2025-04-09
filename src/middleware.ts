import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";  // Pour la vérification de la session
// import { verifyToken } from "@/lib/jwt"; // Pour la vérification du token JWT
import { apiAuthPrefix, publicRoutes, authRoutes, DEFAULT_LOGIN_REDIRECT } from "./routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth(); // Vérification de la session via NextAuth
  const isLoggedIn = !!session; // Si la session est présente

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // Routes API nécessitant un token
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // Routes publiques sans authentification
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Routes d'authentification (login, etc.)

  // Si c'est une route API avec un préfixe auth, vérifie le token
  /** if (!isApiAuthRoute && !isPublicRoute && !isAuthRoute) {
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
  } **/

  // Si la route est d'authentification (login, etc.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Si l'utilisateur est déjà connecté, redirige vers la page principale
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next(); // Sinon, continue normalement
  }

  // Si la route n'est pas publique et que l'utilisateur n'est pas connecté, redirige vers la page de login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Si l'utilisateur est connecté, continue normalement
  return NextResponse.next();
}

// Exclure certains fichiers comme les images ou les assets de ce middleware
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"], // Exclut les fichiers statiques et les dossiers spéciaux
};
