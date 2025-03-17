import React, { useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ButtonSocials from "@/components/ButtonSocials/ButtonSocials";

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

    // Validation email
    if (!email.trim()) {
      newErrors.email = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
      valid = false;
    }

    // Validation mot de passe
    if (!password.trim()) {
      newErrors.password = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    console.log("Formulaire soumis avec succès !");
    setTimeout(() => setLoading(false), 2000); // Simule un chargement
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center">Connexion</h2>

      {/* Message d'erreur */}
      {errors.email || errors.password ? (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>Email ou mot de passe incorrect!</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Mot de passe */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
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
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Se connecter"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center my-4">
        <span className="flex-1 border-t border-gray-300 dark:border-gray-700"></span>
        <span className="px-3 text-gray-500 dark:text-gray-400">ou</span>
        <span className="flex-1 border-t border-gray-300 dark:border-gray-700"></span>
      </div>

      {/* Connexion avec les réseaux sociaux */}
      <ButtonSocials />

      {/* Lien vers inscription */}
      <p className="text-center text-sm mt-4">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Inscrivez-vous ici
        </Link>.
      </p>
    </div>
  );
};

export default LoginCard;
