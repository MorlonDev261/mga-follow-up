"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      localStorage.setItem("token", data.token); // Stocker le token
      router.push("/dashboard"); // Rediriger vers la page principale

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription className="flex items-center gap-1">
            <AiOutlineExclamationCircle /> {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className={cn("form-input", { "not-valid": !!error })}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className={cn("form-input", { "not-valid": !!error })}>
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <IoEyeOffOutline className="icon" onClick={() => setShowPassword(false)} />
            ) : (
              <IoEyeOutline className="icon" onClick={() => setShowPassword(true)} />
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Se connecter"}
        </Button>
      </form>

      <div className="link-to-login">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/auth/sign-up" className="text-primary">Inscrivez-vous ici</Link>.
      </div>
    </div>
  );
};

export default LoginCard;
