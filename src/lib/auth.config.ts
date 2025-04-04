import GitHub from "next-auth/providers/github"
import type { AuthOptions } from "next-auth"

export default {
  providers: [GitHub],
} satisfies AuthOptions
