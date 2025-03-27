import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
    role?: string;
  }

  interface Session {
    user: User & {
      contact?: string;
    };
  }

  interface JWT {
    firstName?: string;
    lastName?: string;
    role?: string;
    contact?: string;
  }
}
