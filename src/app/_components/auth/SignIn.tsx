"use client";

import React, { useState, useRef } from "react";
import "./CSS/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { z } from "zod";

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation côté client avec `zod`
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setLoading(false);
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: email, password }),
        credentials: "include", // Permet d'envoyer les cookies HTTP-only
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      router.push("/"); // Redirection sécurisée

    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur inattendue");
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
          <div className={cn("form-input", { "not-valid": errors.email })}>
            <FaEnvelope className="icon" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className={cn("form-input", { "not-valid": errors.password })}>
            <FaLock className="icon" />
            <input
              ref={passwordRef}
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
          {errors.password && <div className="error">{errors.password}</div>}
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
