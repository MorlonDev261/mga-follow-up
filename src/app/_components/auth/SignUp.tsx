"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import ButtonSocials from "@/components/ButtonSocials";

// 🛠️ Définition du schéma de validation avec Zod
const signUpSchema = z
  .object({
    email: z.string().email("Veuillez entrer une adresse e-mail valide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

// 📌 Composant pour les champs de mot de passe (réutilisable)
const PasswordInput = ({ label, register, error }: { 
  label: string; 
  register: any; 
  error?: string; 
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      <div className={cn("form-input", error && "not-valid")}>
        <FaLock className="icon" />
        <input
          type={show ? "text" : "password"}
          placeholder={label}
          {...register}
        />
        {show ? (
          <IoEyeOffOutline className="icon" onClick={() => setShow(false)} />
        ) : (
          <IoEyeOutline className="icon" onClick={() => setShow(true)} />
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

// 📌 Composant principal SignUpCard
const SignUpCard: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 🔥 Gestion de la soumission du formulaire
  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setApiError(null);
      const response = await axios.post("/api/auth/signup", data);
      
      if (response.status === 201) {
        console.log("Inscription réussie !", response.data);
        router.push("/dashboard"); // ✅ Rediriger après succès
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data.message || "Une erreur est survenue");
      } else {
        setApiError("Une erreur inattendue est survenue");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      
      {/* 🔥 Gestion des erreurs API */}
      {apiError && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription className="flex items-center gap-1">
            <AiOutlineExclamationCircle /> {apiError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 📨 Champ e-mail */}
        <div className="form-group">
          <div className={cn("form-input email", errors.email && "not-valid")}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email?.message && <div className="error">{errors.email.message}</div>}
        </div>

        {/* 🔐 Champ mot de passe */}
        <PasswordInput 
          label="Mot de passe" 
          register={register("password")} 
          error={errors.password?.message} 
        />

        {/* 🔑 Champ confirmation mot de passe */}
        <PasswordInput 
          label="Confirmez le mot de passe" 
          register={register("confirmPassword")} 
          error={errors.confirmPassword?.message} 
        />

        {/* 🎯 Bouton de soumission */}
        <Button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : "S'inscrire"}
        </Button>
      </form>

      {/* 🌎 Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      <ButtonSocials />

      {/* 🔗 Lien vers connexion */}
      <div className="link-to-login">
        Déjà un compte ? <Link href="/auth/sign-in">Connectez-vous ici</Link>.
      </div>
    </div>
  );
};

export default SignUpCard;
