"use client";

import React, { useState, useRef } from "react";
import "./CSS/styles.css";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { z } from "zod";
import ButtonSocials from "@components/ButtonSocials";

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

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    setLoading(false);
    setErrors({
      email: validation.error.flatten().fieldErrors.email?.[0], // Prend uniquement la première erreur
      password: validation.error.flatten().fieldErrors.password?.[0],
    });
    return;
  }

  setErrors({});

 /* const result = await signIn("credentials", {
    redirect: false,
    contact: email, // Corrige aussi ici (avant c'était `contact`, qui ne correspond pas au champ attendu)
    password,
  });

  if (result?.error) {
    setError(result.error);
  } else {
    router.push("/");
  } */

  setLoading(false);
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

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <ButtonSocials />
      
      <div className="link-to-login">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/sign-up" className="text-primary">Inscrivez-vous ici</Link>.
      </div>
    </div>
  );
};

export default LoginCard;
