import GitHub from "next-auth/providers/github"
import type AuthConfig from "next-auth";

export default { 
  providers: [GitHub] 
} satisfies AuthConfig
