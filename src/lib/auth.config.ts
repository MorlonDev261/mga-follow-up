import type { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "@/lib/db";
import { z } from "zod";

const credentialsSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

// Vérification des variables d'environnement
const env = {
  GITHUB: {
    ID: process.env.AUTH_GITHUB_ID,
    SECRET: process.env.AUTH_GITHUB_SECRET
  },
  GOOGLE: {
    ID: process.env.AUTH_GOOGLE_ID,
    SECRET: process.env.AUTH_GOOGLE_SECRET
  },
  SECRET: process.env.NEXTAUTH_SECRET
} as const;

if (!env.GITHUB.ID || !env.GITHUB.SECRET) {
  throw new Error("Configuration GitHub manquante");
}

if (!env.GOOGLE.ID || !env.GOOGLE.SECRET) {
  throw new Error("Configuration Google manquante");
}

if (!env.SECRET) {
  throw new Error("NEXTAUTH_SECRET manquant");
}

const secureCookies = process.env.NODE_ENV === "production" ? {
  sessionToken: {
    name: "__Secure-next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      domain: process.env.NEXTAUTH_COOKIE_DOMAIN
    }
  }
} : undefined;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GitHub({
      clientId: env.GITHUB.ID,
      clientSecret: env.GITHUB.SECRET,
      authorization: { params: { scope: "user:email" } },
      profile(profile) {
        return {
          id: profile.id.toString(),
          contact: profile.email || `${profile.id}@github.none`,
          firstName: profile.name?.split(" ")[0] || "Nouveau",
          lastName: profile.name?.split(" ").slice(1).join(" ") || "Utilisateur",
          role: "USER"
        } satisfies User;
      }
    }),

    Google({
      clientId: env.GOOGLE.ID,
      clientSecret: env.GOOGLE.SECRET,
      authorization: { 
        params: { 
          access_type: "offline",
          prompt: "consent",
          scope: "openid email profile" 
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          contact: profile.email || `${profile.sub}@google.none`,
          firstName: profile.given_name || "Nouveau",
          lastName: profile.family_name || "Utilisateur",
          role: "USER"
        } satisfies User;
      }
    }),

    Credentials({
      name: "Identifiants",
      credentials: {
        contact: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          const validated = credentialsSchema.safeParse(credentials);
          if (!validated.success) {
            console.error("Erreur validation:", validated.error.format());
            return null;
          }

          const user = await db.user.findUnique({
            where: { contact: validated.data.contact },
            select: { 
              id: true, 
              password: true, 
              firstName: true, 
              lastName: true, 
              role: true 
            }
          });

          if (!user) {
            console.log("Utilisateur non trouvé");
            return null;
          }

          if (!user.password) {
            console.log("Compte non activé (pas de mot de passe)");
            return null;
          }

          const isValid = await compare(validated.data.password, user.password);
          if (!isValid) {
            console.log("Mot de passe incorrect");
            return null;
          }

          return {
            id: user.id,
            contact: validated.data.contact,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          } satisfies User;

        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.contact = user.contact;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.contact = token.contact;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    }
  },
  cookies: secureCookies,
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};
