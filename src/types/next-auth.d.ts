import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      contact: string;
      firstName: string;
      lastName: string;
      role: string;
      profilePicture?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    contact: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    contact: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  }
}
