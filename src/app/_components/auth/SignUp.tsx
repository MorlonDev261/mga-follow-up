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
import ButtonSocials from "./ButtonSocials";
import { z } from "zod";
import { useToast } from "@/components/toast-provider"

const signupSchema = z.object({
  email: z.string().trim().superRefine((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner ce champ"
      });
      return z.NEVER;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format d'email invalide"
      });
      return z.NEVER;
    }
    if (val.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 100 caractères"
      });
      return z.NEVER;
    }
  }),
  password: z.string().trim().superRefine((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner ce champ"
      });
      return z.NEVER;
    }
    if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum 8 caractères"
      });
      return z.NEVER;
    }
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Au moins une majuscule"
      });
      return z.NEVER;
    }
    if (!/[0-9]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Au moins un chiffre"
      });
      return z.NEVER;
    }
  }),
  confPassword: z.string().trim().superRefine((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner ce champ"
      });
      return z.NEVER;
    }
  })
}).refine((data) => {
    // Vérifier d'abord si confPassword est vide avant de comparer avec password
    if (data.confPassword !== "" && data.password !== data.confPassword) {
      return false;
    }
    return true;
  }, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confPassword"],
  });

type FormErrors = z.inferFlattenedErrors<typeof signupSchema>["fieldErrors"];

const SignUpCard: React.FC = () => {
  const [formData, setFormData] = useState({
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
  const { toast } = useToast()

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
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
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

      toast({
        description: "Inscription réussie.",
      })
      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
  setFormData((prev) => ({ ...prev, [field]: value }));

  // Vérification immédiate du champ modifié
  const fieldSchema = signupSchema._def.schema.shape[field];
  if (fieldSchema) {
    const validation = fieldSchema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [field]: validation.success ? undefined : validation.error?.flatten().formErrors,
    }));
  }

  // Vérification globale si le mot de passe et la confirmation sont modifiés
  if (field === "password" || field === "confPassword") {
    setErrors((prev) => ({
      ...prev,
      confPassword: formData.password === value || field === "password" ? undefined : ["Les mots de passe ne correspondent pas"],
    }));
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
              disabled={loading}
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
              disabled={loading}
            />
            {showPassword ? (
              <IoEyeOffOutline className="icon text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(false)} />
            ) : (
              <IoEyeOutline className="icon text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(true)} />
            )}
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
              disabled={loading}
            />
            {showConfPassword ? (
              <IoEyeOffOutline className="icon text-muted-foreground hover:text-foreground" onClick={() => setShowConfPassword(false)} />
            ) : (
              <IoEyeOutline className="icon text-muted-foreground hover:text-foreground" onClick={() => setShowConfPassword(true)} />
            )}
          </div>
          {errors.confPassword?.map((msg, i) => (
            <p key={i} className="text-sm text-destructive mt-1">{msg}</p>
          ))}
        </div>

        <Button type="submit" className="w-full text-white bg-green-600 dark:bg-orange-600" disabled={loading}>
          {loading ? <Spinner size="sm" className="mx-auto" /> : "S'inscrire"}
        </Button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <ButtonSocials isPending={loading} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Connectez-vous ici
        </Link>
      </p>
    </div>
  );
};

export default SignUpCard;
