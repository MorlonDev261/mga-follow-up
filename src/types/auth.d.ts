// src/types/auth.d.ts

import 'next-auth'
import 'next-auth/jwt'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
  }

  interface JWT {
    id: string
    email: string
    name?: string
    image?: string
  }
}
