import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

// Schéma de validation Zod amélioré
const credentialsSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

export default {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login/error",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "user:email",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          contact: profile.email,
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        contact: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = credentialsSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            return null;
          }

          const { contact, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { contact },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            contact: user.contact,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.contact = user.contact;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.contact = token.contact;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
    async signIn({ account }) {
      // Restreint l'accès aux comptes email non vérifiés si nécessaire
      if (account?.provider === "credentials") {
        return true;
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
