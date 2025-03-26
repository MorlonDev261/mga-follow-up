import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { compare } from "bcryptjs";
import db from "@/lib/db";
import { z } from "zod";

// Schéma de validation des entrées
const loginSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Page de connexion personnalisée
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        contact: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials?.contact || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { contact: credentials.contact }
        });

        if(!existingUser) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, existingUser.password);

        if(!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          contact: existingUser.contact,
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && (account.provider === 'github' || account.provider === 'google')) {
        if (!user.email) {
          throw new Error("Email is missing from the user data.");
        }

        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = await db.user.findUnique({
          where: { contact: user.email },
        });

        if (!existingUser) {
          // Créer un nouvel utilisateur si ce n'est pas le cas
          await db.user.create({
            data: {
              contact: user.email,
              firstName: profile?.given_name || '',
              lastName: profile?.family_name || '',
              // Vous pouvez ajouter d'autres champs ici en fonction de votre modèle d'utilisateur
            },
          });
        }
      }
    return true;
  },
 }
} satisfies NextAuthConfig;
