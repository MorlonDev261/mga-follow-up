import NextAuth, { type AuthOptions } from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies AuthOptions);
