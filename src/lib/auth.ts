import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies NextAuthConfig);
