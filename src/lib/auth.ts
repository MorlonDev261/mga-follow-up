import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { NextAuthOptions } from "next-auth";

const authInstance = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies NextAuthOptions);

console.log("Auth instance:", authInstance); // Debug

export const { handlers, signIn, signOut, auth } = authInstance;
