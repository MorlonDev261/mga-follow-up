import NextAuth from "@auth/core";
import type { AuthConfig } from "@auth/core";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
} satisfies AuthConfig);
