"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ButtonSocials from "@components/ButtonSocials";

type LoginFormInputs = {
  email: string;
  password: string;
  remember: boolean;
};

const LoginCard: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Login Success:", data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Champ email */}
        <div className="form-group">
          <div className={`form-input ${errors.email ? "not-valid" : ""}`}>
            <FaEnvelope className="icon" />
            <Input
              type="email"
              placeholder="Adresse e-mail"
              {...register("email", { required: "Veuillez entrer votre email." })}
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
              {...register("password", { required: "Veuillez entrer votre mot de passe." })}
            />
            {showPassword ? (
              <IoEyeOffOutline className="icon" onClick={() => setShowPassword(false)} />
            ) : (
              <IoEyeOutline className="icon" onClick={() => setShowPassword(true)} />
            )}
          </div>
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {/* Case à cocher "Se souvenir de moi" */}
        <div className="flex items-center gap-2">
          <Checkbox {...register("remember")} />
          <p>Se souvenir de moi</p>
        </div>

        {/* Bouton de connexion */}
        <Button type="submit" className="btn w-full mt-4">
          {loading ? <Spinner size="sm" className="mr-2" /> : "Se connecter"}
        </Button>
      </form>

      {/* Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      <ButtonSocials />

      {/* Lien vers inscription */}
      <div className="link-to-register">
        Pas encore de compte ? <Link href="/auth/sign-up">Inscrivez-vous ici</Link>.
      </div>
    </div>
  );
};

export default LoginCard;
