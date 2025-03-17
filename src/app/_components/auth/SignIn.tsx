"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import "./CSS/styles.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import ButtonSocials from "@components/ButtonSocials";

const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    console.log("Formulaire soumis avec succès !");
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <Alert variant="destructive" className="mb-3">
        <AlertDescription><AiOutlineExclamationCircle /> Email ou mot de passe incorrect!</AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className={cn("form-input", { "not-valid": errors.email })}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              ref={emailRef}
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
          </div>
          {errors.email && <div id="email-error" className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className={cn("form-input", { "not-valid": errors.password })}>
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              ref={passwordRef}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
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

      <div className="divider">
        <span>ou</span>
      </div>

      <ButtonSocials />

      <div className="link-to-login">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/auth/sign-up" className="text-primary">Inscrivez-vous ici</Link>.
      </div>
    </div>
  );
};

export default LoginCard;
