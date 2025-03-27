import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" }, // Correction automatique via satisfies
  ...authConfig,
} satisfies AuthOptions);
