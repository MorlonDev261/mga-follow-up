"use client";

import React, { useState, useRef } from "react";
import "./CSS/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { z } from "zod";

// Schéma de validation aligné avec l'API
const signupSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  profilePicture: z.string().url("URL invalide").optional().or(z.literal("")),
  coverPicture: z.string().url("URL invalide").optional().or(z.literal("")),
});

type FormErrors = z.inferFlattenedErrors<typeof signupSchema>["fieldErrors"];

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: "",
    coverPicture: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation côté client
    const validation = signupSchema.safeParse(formData);
    if (!validation.success) {
      setLoading(false);
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.data,
          contact: validation.data.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Redirection vers la page de connexion avec statut de succès
      router.push("/auth/login?signup=success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription className="flex items-center gap-1">
            <AiOutlineExclamationCircle /> {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <FaUser className="text-gray-500" /> Prénom *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={cn(errors.firstName && "border-red-500")}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="w-full">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <FaUser className="text-gray-500" /> Nom *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={cn(errors.lastName && "border-red-500")}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500" /> Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(errors.email && "border-red-500")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <FaLock className="text-gray-500" /> Mot de passe *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={cn(errors.password && "border-red-500", "pr-10")}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profilePicture" className="flex items-center gap-2">
            <FaImage className="text-gray-500" /> Photo de profil (URL)
          </Label>
          <Input
            id="profilePicture"
            type="url"
            value={formData.profilePicture}
            onChange={(e) => handleChange('profilePicture', e.target.value)}
            className={cn(errors.profilePicture && "border-red-500")}
          />
          {errors.profilePicture && <p className="text-sm text-red-500">{errors.profilePicture}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverPicture" className="flex items-center gap-2">
            <FaImage className="text-gray-500" /> Photo de couverture (URL)
          </Label>
          <Input
            id="coverPicture"
            type="url"
            value={formData.coverPicture}
            onChange={(e) => handleChange('coverPicture', e.target.value)}
            className={cn(errors.coverPicture && "border-red-500")}
          />
          {errors.coverPicture && <p className="text-sm text-red-500">{errors.coverPicture}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "S'inscrire"}
        </Button>
      </form>

      <div className="link-to-login">
        Déjà un compte ?{" "}
        <Link href="/auth/login" className="text-primary">
          Connectez-vous ici
        </Link>
      </div>
    </div>
  );
};

export default SignUpCard;
