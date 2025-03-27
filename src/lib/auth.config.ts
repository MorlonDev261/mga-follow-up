import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import type { NextAuthConfig } from "next-auth";

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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: getEnv("AUTH_SECRET"),
  trustHost: true,
} satisfies NextAuthConfig;
