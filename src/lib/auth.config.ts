import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const credentialsSchema = z.object({
  contact: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

export default {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: { params: { scope: "user:email" } },
      profile(profile) {
        return {
          id: profile.id.toString(),
          contact: profile.email,
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
          role: "USER"
        };
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
      profile(profile) {
        return {
          id: profile.sub,
          contact: profile.email,
          firstName: profile.given_name || '',
          lastName: profile.family_name || '',
          role: "USER"
        };
      }
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        contact: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          const validated = credentialsSchema.safeParse(credentials);
          if (!validated.success) return null;

          const user = await db.user.findUnique({
            where: { contact: validated.data.contact },
            select: { id: true, password: true, firstName: true, lastName: true, role: true }
          });

          if (!user?.password) return null;
          if (!await compare(validated.data.password, user.password)) return null;

          return {
            id: user.id,
            contact: validated.data.contact,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          };
        } catch (error) {
          console.error("Auth Error:", error);
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
      if (token && session.user) {
        session.user.id = token.id;
        session.user.contact = token.contact;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
} satisfies NextAuthConfig;
