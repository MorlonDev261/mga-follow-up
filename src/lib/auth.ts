import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { NextAuthOptions } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies NextAuthOptions);
