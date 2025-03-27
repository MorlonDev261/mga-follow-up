declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    coverPicture?: string;
    role?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }

  interface JWT {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    coverPicture?: string;
    role?: string;
  }
}
