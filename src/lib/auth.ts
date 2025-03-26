import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};
