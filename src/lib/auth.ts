import NextAuth from "next-auth";
import authConfig from "./auth.config";

const config = {
  ...authConfig,
  session: { strategy: "jwt" }, 
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
