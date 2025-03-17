import React, { useState, useRef } from "react";
import { Alert, CircularProgress } from "@mui/material";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ButtonSocials from "@components/ButtonSocials/ButtonSocials";
import "@components/SignUp/CSS/SignUpLoginCard.css";

const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loadings, setLoadings] = useState({
    submit: false,
    linkedin: false,
    google: false,
    outlook: false,
  });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Validation de l'e-mail
    if (!email.trim()) {
      newErrors.email = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
      valid = false;
    }

    // Validation du mot de passe
    if (!password.trim()) {
      newErrors.password = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
      valid = false;
    }

    setErrors(newErrors);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailRef.current?.focus();
    }else if (!password.trim()) {
      passwordRef.current?.focus();
    }

    if (valid) {
      setLoadings((prev) => ({ ...prev, submit: true }));
      console.log("Formulaire soumis avec succès !");
      setTimeout(() => setLoadings((prev) => ({ ...prev, submit: false })), 2000); // Simule un chargement
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <Alert className="mb-3" severity="error">
        Email ou mot de passe incorrect!
      </Alert>
      <form onSubmit={handleSubmit}>
        {/* Champ e-mail */}
        <div className="form-group">
          <div className={`form-input email ${errors.email ? "not-valid" : ""}`}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              id="email"
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

        {/* Champ mot de passe */}
        <div className="form-group">
          <div className={`form-input mdp1 ${errors.password ? "not-valid" : ""}`}>
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
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

        {/* Conditions générales */}
        <div className="checkbox-container">
          <label className="custom-checkbox">
            <input type="checkbox" />
            <span
              className="checkmark"
            ></span>
          </label>
          <p className="docs">Se souvenir de moi</p>
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="btn">
          {loadings.submit ? (
            <CircularProgress className="progress" size={20} thickness={6} />
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      {/* Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      
      <ButtonSocials />

      {/* Lien vers inscription */}
      <div className="link-to-login">
        Vous n&apos;avez pas encore un compte ?{" "}
        <Link href="/signup">Inscrivez-vous ici</Link>.
      </div>
    </div>
  );
};

export default LoginCard;
