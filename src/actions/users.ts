interface UpdateUserPayload {
  userId: string;
  name?: string;
  image?: string;
  coverPicture?: string;
}

export async function updateUser(payload: UpdateUserPayload) {
  const res = await fetch(`/api/users/${payload.userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Échec de la mise à jour");
  return res.json();
}
