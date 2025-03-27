import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut } = NextAuth(authConfig);
export { auth } from "next-auth";
