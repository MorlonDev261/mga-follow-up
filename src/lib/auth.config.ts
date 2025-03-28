import type { AuthOptions } from "next-auth";

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" as const }, // Ajout du `as const`
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export default authConfig;
