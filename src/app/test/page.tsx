'use client';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <button 
        onClick={() => signIn("github")}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Se connecter avec GitHub
      </button>

      <button
        onClick={() => signIn("google")}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Se connecter avec Google
      </button>

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await signIn("credentials", {
            contact: formData.get("contact"),
            password: formData.get("password"),
            redirect: false
          });
        }}
      >
        <input 
          name="contact" 
          type="email" 
          placeholder="Email"
          className="block mb-2 p-2 border"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          className="block mb-2 p-2 border"
          required
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
