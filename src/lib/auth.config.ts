import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" as const }, // Ajout du `as const`
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
};

export default authConfig;
