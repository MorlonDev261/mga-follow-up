import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Credentials({
        Credentials({
      async authorize(credentials) {
        try {
          const validated = loginSchema.parse(credentials);
          const user = await db.user.findUnique({
            where: { email: validated.email },
          });

          if (!user || !user.password) {
            throw new Error("Identifiants invalides");
          }

          const passwordValid = await compare(validated.password, user.password);
          if (!passwordValid) {
            throw new Error("Identifiants invalides");
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors de l'authentification";
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
