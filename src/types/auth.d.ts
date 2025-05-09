import 'next-auth';
import 'next-auth/jwt';
import { Prisma } from '@prisma/client';
import type { DefaultSession, DefaultUser } from 'next-auth';

// Définir le type Company en dehors
type Company = {
  id: string;
  name: string;
  createdAt: Date; 
  desc: string; 
  nif: string | null; 
  stat: string | null; 
  owner: string; 
  contact: string; 
  address: string; 
  logo: Prisma.JsonValue | null;
  userRole: string;
};

// Étendre les types NextAuth
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      coverPicture?: string;
      emailVerified?: Date | null;
      createdAt?: string;
    };
    company?: Company;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string;
    image?: string;
    coverPicture?: string;
    emailVerified?: Date | null;
    createdAt?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    image?: string;
    coverPicture?: string;
    emailVerified?: Date | null;
    createdAt?: string;
  }
}
