import { authMiddleware } from "next-auth/middleware";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";

export default authMiddleware({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      const isLoggedIn = !!token;

      const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
      const isPublicRoute = publicRoutes.includes(pathname);
      const isAuthRoute = authRoutes.includes(pathname);

      if (isApiAuthRoute) return true;

      if (isAuthRoute) return !isLoggedIn;

      return isLoggedIn || isPublicRoute;
    },
  },
  pages: {
    signIn: "/login",
  },
  redirect: async ({ url, baseUrl }) => {
    return url.startsWith(baseUrl) ? url : new URL(DEFAULT_LOGIN_REDIRECT, baseUrl).toString();
  },
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
