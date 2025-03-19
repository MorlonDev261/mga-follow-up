import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { NextAuthOptions } from "next-auth";

const authInstance = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies NextAuthOptions);

export const handlers = authInstance.handlers ?? {};
export const signIn = authInstance.signIn;
export const signOut = authInstance.signOut;
export const auth = authInstance.auth;
