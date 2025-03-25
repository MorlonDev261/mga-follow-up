import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { compare } from "bcryptjs";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schéma de validation des entrées
const loginSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION = "7d";

export default {
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
        try {
          const validation = loginSchema.safeParse(credentials);
          if (!validation.success) {
            throw new Error("Données invalides");
          }

          const { contact, password } = validation.data;

          // Vérifier si l'utilisateur existe
          const user = await db.user.findUnique({
            where: { contact },
            select: { 
              id: true, 
              contact: true,
              password: true, 
              firstName: true, 
              lastName: true 
            }
          });

          if (!user) {
            throw new Error("Identifiants incorrects");
          }

          // Vérifier le mot de passe
          const passwordMatch = await compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Identifiants incorrects");
          }

          // Générer un token JWT
          const token = jwt.sign(
            { 
              id: user.id, 
              contact: user.contact, 
              name: `${user.firstName} ${user.lastName}` 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
          );

          return { 
            id: user.id.toString(), 
            name: `${user.firstName} ${user.lastName}`, 
            email: user.contact,
            token 
          };

        } catch (error) {
          console.error("[NextAuth Credentials]", error);
          throw new Error("Erreur d'authentification");
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && (account.provider === 'github' || account.provider === 'google')) {
        (!user.email) {
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.token = token.token;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: JWT_SECRET,
  pages: {
    signIn: "/login", // Page de connexion personnalisée
  }
} satisfies NextAuthConfig;
