

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
  interface JWT {
    id: string;
  }
}
