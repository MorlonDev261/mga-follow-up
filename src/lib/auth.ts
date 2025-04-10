import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import moment from 'moment'

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password.')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        const existingUser = await db.user.findUnique({
          where: { email: user.email as string },
        })

        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email as string,
              name: user.name,
              image: user.image
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ""
        token.email = user.email ?? ""
        token.name = user.name ?? ""
        token.coverPicture = user.coverPicture ?? ""
        token.image = user.image ?? ""
        token.emailVerified = user.emailVerified ?? ""
        token.createdAt = user.createdAt ?? ""
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email ?? ""
        session.user.name = token.name ?? ""
        session.user.coverPicture = token.coverPicture ?? ""
        session.user.image = token.image ?? ""
        session.user.emailVerified = token.emailVerified ? moment(token.emailVerified).format('YYYY-MM-DD') : null;
        session.user.createdAt = token.createdAt ?? ""
      }
      return session
    },
  },
  secret: process.env.JWT_SECRET || 'your_secret_key',
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
