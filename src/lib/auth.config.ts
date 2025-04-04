import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";

const config = {
  providers: [GitHub()],
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
