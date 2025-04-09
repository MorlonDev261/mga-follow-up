import db from "@/lib/db";
import { auth } from "@/lib/auth";

type UpdateUserInput = {
  name?: string;
  tel?: string;
  image?: string;
  coverPicture?: string;
};

export async function updateUser(data: UpdateUserInput) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Non authentifié");
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data,
  });

  return updatedUser;
}
