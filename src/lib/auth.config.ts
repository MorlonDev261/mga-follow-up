import { z } from 'zod'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { NextApiRequest } from 'next'

// Schéma de validation avec Zod
const credentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined, _req: NextApiRequest): Promise<{ id: string; email: string; name: string; } | null> {
        try {
          if (!credentials) {
            throw new Error('Credentials are required')
          }

          // Validation avec Zod
          const validatedCredentials = credentialsSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          })

          if (!user) {
            throw new Error('Invalid email or password.')
          }

          if (typeof validatedCredentials.password !== 'string') {
            throw new Error('Password is required')
          }

          const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid email or password.')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Vous pourriez vouloir logger les erreurs de validation ici
            throw new Error('Invalid credentials data')
          }
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    },
  },
  secret: process.env.JWT_SECRET,
}
