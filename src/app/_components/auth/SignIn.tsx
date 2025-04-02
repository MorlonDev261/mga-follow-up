"use client";

import React, { useState, useRef, useTransition } from "react";
import Link from "next/link";
import "./CSS/styles.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { z } from "zod";
import ButtonSocials from "./ButtonSocials";
import { login } from "@/actions/auth/login";

// Schéma de validation
const LoginSchema = z.object({
  email: z.string().min(1, "Veuillez remplir ce champ.").email("Veuillez entrer un email valide."),
  password: z.string().min(1, "Veuillez remplir ce champ."),
});

const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Empêcher le rechargement de la page
    setError(null);

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setErrors({
        email: validation.error.flatten().fieldErrors.email?.[0],
        password: validation.error.flatten().fieldErrors.password?.[0],
      });
      return;
    }

    startTransition(async () => {
      const result = await login({ email, password });
      if (result?.error) {
        setError(result.error);
      }
    });

    console.log({ email, password });
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

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <div className={cn("form-input", { "not-valid": errors.email })}>
            <FaEnvelope className="icon" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              disabled={isPending}
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
              disabled={isPending}
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Spinner size="sm" /> : "Se connecter"}
        </Button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">OU</span>
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
