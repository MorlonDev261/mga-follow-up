import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Préfixes à ignorer
const apiAuthPrefix = "/api/auth"
const publicRoutes = ["/", "/login", "/register"]
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  // Bypass pour les routes NextAuth
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  // Si la route est publique, ne rien faire
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Vérifie si l'utilisateur est connecté
  const session = await auth()

  // Si utilisateur NON connecté
  if (!session) {
    // S'il essaie d'accéder à une page protégée → redirect vers login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si l'utilisateur connecté essaie d'aller sur /login ou /register → redirect vers /
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Sinon, on le laisse passer
  return NextResponse.next()
}
