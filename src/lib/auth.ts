import NextAuth from "next-auth/config"; // ✅ c’est ici la bonne source
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
