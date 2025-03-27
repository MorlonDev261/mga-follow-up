"use client";

import { signIn } from "next-auth/react";

const handleLogin = async () => {
  const result = await signIn("credentials", {
    redirect: false,
    contact: "test@example.com",
    password: "motdepasse",
  });

  console.log(result); // Vérifie la réponse ici
};

<button onClick={handleLogin}>Se connecter</button>;
