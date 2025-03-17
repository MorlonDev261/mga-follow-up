"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ButtonSocials from "@components/ButtonSocials";

type SignUpFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const SignUpCard: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const onSubmit = (data: SignUpFormInputs) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Inscription réussie:", data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Champ email */}
        <div className="form-group">
          <div className={`form-input ${errors.email ? "not-valid" : ""}`}>
            <FaEnvelope className="icon" />
            <Input
              type="email"
              placeholder="Adresse e-mail"
              {...register("email", {
                required: "Veuillez entrer une adresse e-mail.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Adresse e-mail invalide.",
                },
              })}
            />
          </div>
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Champ mot de passe */}
        <div className="form-group">
          <div className={`form-input ${errors.password ? "not-valid" : ""}`}>
            <FaLock className="icon" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", {
                required: "Veuillez entrer un mot de passe.",
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères.",
                },
              })}
            />
            {showPassword ? (
              <IoEyeOffOutline className="icon" onClick={() => setShowPassword(false)} />
            ) : (
              <IoEyeOutline className="icon" onClick={() => setShowPassword(true)} />
            )}
          </div>
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {/* Champ confirmation mot de passe */}
        <div className="form-group">
          <div className={`form-input ${errors.confirmPassword ? "not-valid" : ""}`}>
            <FaLock className="icon" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmez le mot de passe"
              {...register("confirmPassword", {
                required: "Veuillez confirmer votre mot de passe.",
                validate: (value) =>
                  value === watch("password") || "Les mots de passe ne correspondent pas.",
              })}
            />
            {showConfirmPassword ? (
              <IoEyeOffOutline className="icon" onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <IoEyeOutline className="icon" onClick={() => setShowConfirmPassword(true)} />
            )}
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>

        {/* Conditions générales */}
        <div className="flex items-center gap-2 mt-2">
          <Checkbox {...register("acceptTerms", { required: "Vous devez accepter les CGU." })} />
          <p className="text-sm">
            J&apos;accepte les{" "}
            <Link href="/terms" className="underline">conditions générales</Link> et les{" "}
            <Link href="/rules" className="underline">règles</Link>.
          </p>
        </div>

        {/* Bouton d'inscription */}
        <Button type="submit" className="btn w-full mt-4">
          {loading ? <Spinner size="sm" className="mr-2" /> : "S&apos;inscrire"}
        </Button>
      </form>

      {/* Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      <ButtonSocials />

      <div className="link-to-login">
        Déjà un compte ? <Link href="/auth/sign-in">Connectez-vous ici</Link>.
      </div>
    </div>
  );
};

export default SignUpCard;
