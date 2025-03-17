import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import ButtonSocials from "@components/ButtonSocials/ButtonSocials";

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
      if (!email.trim()) emailRef.current?.focus();
      else if (!password.trim()) passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Simule un chargement
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">Connexion</h2>

      <Alert variant="destructive" className="mt-3">
        <AlertDescription>Email ou mot de passe incorrect!</AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Champ e-mail */}
        <div>
          <div className={cn("relative", errors.email && "border-red-500")}>
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              ref={emailRef}
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className="pl-10"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Champ mot de passe */}
        <div>
          <div className={cn("relative", errors.password && "border-red-500")}>
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              ref={passwordRef}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className="pl-10 pr-10"
            />
            {showPassword ? (
              <IoEyeOffOutline
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Checkbox "Se souvenir de moi" */}
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm">
            Se souvenir de moi
          </label>
        </div>

        {/* Bouton de connexion */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>

      {/* Separator */}
      <div className="relative flex items-center my-6">
        <span className="w-full border-t"></span>
        <span className="px-3 text-sm text-gray-500">ou</span>
        <span className="w-full border-t"></span>
      </div>

      {/* Boutons sociaux */}
      <ButtonSocials />

      {/* Lien vers l'inscription */}
      <p className="mt-4 text-center text-sm">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Inscrivez-vous ici
        </Link>.
      </p>
    </div>
  );
};

export default LoginCard;
