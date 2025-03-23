"use client";

import React, { useState } from "react";
import "./CSS/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string()
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ -]+$/, "Caractères non autorisés"),
  lastName: z.string()
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ -]+$/, "Caractères non autorisés"),
  email: z.string().email("Format d'email invalide").max(100),
  password: z.string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre")
    .regex(/[!@#$%^&*]/, "Au moins un caractère spécial"),
  confPassword: z.string()
})
.refine(data => data.password === data.confPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confPassword"]
});

type FormErrors = z.inferFlattenedErrors<typeof signupSchema>["fieldErrors"];

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        if (data.details) {
          const apiErrors = data.details.reduce(
            (acc: Record<string, string[]>, err: { field: string; message: string }) => ({
              ...acc,
              [err.field]: [err.message]
            }), 
            {} as Record<string, string[]>
          );
          setErrors(apiErrors);
        }
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      router.push("/auth/login?signup=success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      const validation = signupSchema.safeParse({
        ...formData,
        [field]: value
      });
      
      if (validation.success) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-2xl font-bold mb-6">Créer un compte</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center gap-2">
            <AiOutlineExclamationCircle className="shrink-0" />
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between gap-2">
          <div className="space-y-2 form-group">
            <Label htmlFor="firstName">Prénom</Label>
            <div className={cn(errors.firstName && "border-destructive")}>
              <input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                aria-invalid={!!errors.firstName}
              />
            </div>
            {errors.firstName?.map((msg, i) => (
              <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
            ))}
          </div>

          <div className="space-y-2 form-group">
            <Label htmlFor="lastName">Nom</Label>
            <div className={cn(errors.lastName && "border-destructive")}>
              <input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                aria-invalid={!!errors.lastName}
              />
            </div>
            {errors.lastName?.map((msg, i) => (
              <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
            ))}
          </div>
        </div>

        <div className="space-y-2 form-group">
          <Label htmlFor="email">Email</Label>
          <div className={cn("form-input", errors.email && "border-destructive")}>
            <FaEnvelope className="text-muted-foreground icon" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email?.map((msg, i) => (
            <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
          ))}
        </div>

        <div className="space-y-2 form-group">
          <Label htmlFor="password">Mot de passe</Label>
          <div className={cn("form-input", errors.password && "border-destructive")}>
            <FaLock className="text-muted-foreground icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground flex justify-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          {errors.password?.map((msg, i) => (
            <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
          ))}
        </div>

        <div className="space-y-2 form-group">
          <Label htmlFor="confPassword">Confirmer le mot de passe</Label>
          <div className={cn("form-input", errors.confPassword && "border-destructive")}>
            <FaLock className="text-muted-foreground icon" />
            <input
              id="confPassword"
              type={showConfPassword ? "text" : "password"}
              value={formData.confPassword}
              onChange={(e) => handleChange('confPassword', e.target.value)}
              aria-invalid={!!errors.confPassword}
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground flex justify-center"
              onClick={() => setShowConfPassword(!showConfPassword)}
              aria-label={showConfPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          {errors.confPassword?.map((msg, i) => (
            <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size="sm" className="mx-auto" /> : "S'inscrire"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Connectez-vous ici
        </Link>
      </p>
    </div>
  );
};

export default SignUpCard;
