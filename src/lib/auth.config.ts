import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(
          credentials.password, // Assurez-vous que credentials.password est une chaîne
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Personnalisez votre page de connexion
  },
  session: {
    strategy: "jwt", // Utilisez JWT pour la gestion des sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous que NEXTAUTH_SECRET est configuré dans .env
};

export default NextAuth(authOptions);
