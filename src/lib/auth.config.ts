import GitHub from "next-auth/providers/github";

const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
};

export default authConfig;
