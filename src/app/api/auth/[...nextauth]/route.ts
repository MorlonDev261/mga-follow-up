import { handlers } from "@/lib/auth"; 

if (!handlers) throw new Error("NextAuth handlers is undefined"); // Debug

export const { GET, POST } = handlers;
