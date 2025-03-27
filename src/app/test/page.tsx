"use client";

import { signIn } from "next-auth/react";



export default async function Page() {
  const handleLogin = async () => {
  const result = await signIn("credentials", {
    redirect: false,
    contact: "morlonrnd5@gmail.com",
    password: "12345678M$",
  });

  console.log(result); // Vérifie la réponse ici
};
  return (
    <button onClick={handleLogin}>Se connecter</button>;
  );
}
