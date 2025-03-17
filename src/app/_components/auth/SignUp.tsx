"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import "./CSS/styles.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import ButtonSocials from "@components/ButtonSocials";

const SignUpCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "", password: "", confirmPassword: "", acceptTerms: "" };

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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      else if (newErrors.confirmPassword) confirmPasswordRef.current?.focus();
      return;
    }

    setLoading(true);
    console.log("Formulaire soumis avec succès !");
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <Alert variant="destructive" className="mb-3">
        <AlertDescription className="flex gap-1"><AiOutlineExclamationCircle /> Email ou mot de passe incorrect!</AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit}>
        {/* Champ e-mail */}
        <div className="form-group">
          <div className={cn("form-input email", errors.email && "not-valid")}>
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
            />
          </div>
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        {/* Champ mot de passe */}
        <div className="form-group">
          <div className={cn("form-input mdp1", errors.password && "not-valid")}>
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

        {/* Champ confirmation mot de passe */}
        <div className="form-group">
          <div className={cn("form-input mdp2", errors.confirmPassword && "not-valid")}>
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              ref={confirmPasswordRef}
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {showConfirmPassword ? (
              <IoEyeOffOutline className="icon" onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <IoEyeOutline className="icon" onClick={() => setShowConfirmPassword(true)} />
            )}
          </div>
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        {/* Conditions générales 
        <div className={cn("checkbox-container", errors.acceptTerms && "not-valid")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <label htmlFor="acceptTerms" className="custom-checkbox">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="checkmark"></span>
              </label>
            </TooltipTrigger>
            {errors.acceptTerms && (
              <TooltipContent>{errors.acceptTerms}</TooltipContent>
            )}
          </Tooltip>
          <p className="docs">
            J&apos;accepte les{" "}
            <Link href="/terms">conditions générales</Link> et les{" "}
            <Link href="/rules">règles</Link>.
          </p>
        </div> 
          */}

        {/* Bouton de soumission */}
        <Button type="submit" className="btn" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "S'inscrire"}
        </Button>
      </form>

      {/* Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      <ButtonSocials />

      {/* Lien vers connexion */}
      <div className="link-to-login">
        Déjà un compte ? <Link href="/auth/sign-in">Connectez-vous ici</Link>.
      </div>
    </div>
  );
};

export default SignUpCard;
