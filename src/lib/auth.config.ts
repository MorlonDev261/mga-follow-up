import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import type { NextAuthConfig } from "next-auth";

export default {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ajoute l'ID à l'objet JWT si l'utilisateur est défini
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; // Récupère l'ID depuis le JWT
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
