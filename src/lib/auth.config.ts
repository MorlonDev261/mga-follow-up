import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import { z } from "zod";
import { timingSafeEqual } from "crypto";

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default {
  providers: [
    GitHub({
  clientId: process.env.AUTH_GITHUB_ID as string,
  clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Google({
  clientId: process.env.AUTH_GOOGLE_ID as string,
  clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    Credentials({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Mot de passe", type: "password" },
  },
  async authorize(credentials) {
    try {
      const validated = loginSchema.safeParse(credentials);
      if (!validated.success) return null;

      const user = await db.user.findUnique({
        where: { email: validated.data.email },
      });

      if (!user?.password) return null;

      // Protection contre les attaques de timing
      const isValidPassword = await compare(validated.data.password, user.password);
      if (!isValidPassword) return null;

      return { id: user.id, email: user.email };
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
