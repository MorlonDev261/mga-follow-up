import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      image?: string
      coverPicture?: string
      emailVerified?: Date
      createdAt?: Date
    }
   }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string
      name: string
      email: string
      role: string
      image?: string
      coverPicture?: string
      emailVerified?: Date
      createdAt?: Date
    }
  }
}
