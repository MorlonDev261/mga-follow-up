import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Définir les routes publiques (y compris la page d'accueil et les routes API d'authentification)
const publicRoutes = ["/login", "/register", "/about"];
const apiAuthPrefix = "/api/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser l'accès aux fichiers dans le dossier public
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Vérifier si la route est publique ou commence par /api/auth
  const isPublicRoute = publicRoutes.includes(pathname);
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);

  // Si la route est publique ou est une route API d'authentification, laisser passer la requête
  if (isPublicRoute || isApiAuthRoute) {
    return NextResponse.next();
  }

  // Vérifier la présence du token JWT
  const token = await getToken({ req: request });

  // Si aucun token n'est trouvé, rediriger vers la page de login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si un token est trouvé, continuer la requête
  return NextResponse.next();
}

export const config = {
  // Exclure certains chemins (comme les fichiers statiques, les images, le favicon)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Couvre toutes les routes sauf les assets
};
