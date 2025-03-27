import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import type { AuthConfig } from "@auth/core";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export default {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: getEnv("AUTH_GITHUB_ID"),
      clientSecret: getEnv("AUTH_GITHUB_SECRET"),
    }),
    Google({
      clientId: getEnv("AUTH_GOOGLE_ID"),
      clientSecret: getEnv("AUTH_GOOGLE_SECRET"),
    }),
  ],
  secret: getEnv("AUTH_SECRET"),
  trustHost: true,
} satisfies AuthConfig;
