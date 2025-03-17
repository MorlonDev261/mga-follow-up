import React, { useState, useRef } from "react";
import { Popper, Box, CircularProgress } from "@mui/material";
import Link from "next/link";
import ButtonSocials from "@components/ButtonSocials/ButtonSocials";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./CSS/SignUpLoginCard.css";

const SignUpCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  });
  const [loadings, setLoadings] = useState({
    submit: false,
    linkedin: false,
    google: false,
    outlook: false,
  });
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: "",
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

    // Validation de la confirmation du mot de passe
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez renseigner ce champ.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    // Validation des conditions générales
    if (!acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions générales.";
      valid = false;
    }

    setErrors(newErrors);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailRef.current?.focus();
    }else if (!password.trim() || password.length < 6) {
      passwordRef.current?.focus();
    }else if (!confirmPassword.trim() || password !== confirmPassword) {
      confirmPasswordRef.current?.focus();
    }else if (!acceptTerms) {
      setAnchorEl(checkboxRef.current);
    } else {
      setAnchorEl(null);
    }

    if (valid) {
      setLoadings((prev) => ({ ...prev, submit: true }));
      console.log("Formulaire soumis avec succès !");
      setTimeout(() => setLoadings((prev) => ({ ...prev, submit: false })), 2000); // Simule un chargement
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "accept-terms-popover" : undefined;

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
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

        {/* Champ confirmation mot de passe */}
        <div className="form-group">
          <div className={`form-input mdp2 ${errors.confirmPassword ? "not-valid" : ""}`}>
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
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

        {/* Conditions générales */}
        <div className={`checkbox-container ${errors.acceptTerms ? "not-valid" : ""}`}>
          <label className="custom-checkbox">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                setErrors((prev) => ({ ...prev, acceptTerms: "" }));
              }}
            />
            <span 
              className="checkmark"
              ref={checkboxRef}
            ></span>
          </label>
          <p className="docs">
            J&apos;accepte les{" "}
            <Link href="/terms">conditions générales</Link> et les{" "}
            <Link href="/rules">règles</Link>.
          </p>
        </div>
        {errors.acceptTerms && (
          <Popper 
            id={id} open={open} anchorEl={anchorEl}
            placement="right"
          >
            <Box style={{ minWidth: '100px', width: "auto" }} sx={{ border: 1, p: 1, ml: 1, bgcolor: 'background.paper' }}>
             <p style={{ fontSize: "14px" }}>{ errors.acceptTerms }</p>
            </Box>
          </Popper>
        )}

        {/* Bouton de soumission */}
        <button type="submit" className="btn">
          {loadings.submit ? (
            <CircularProgress className="progress" size={20} thickness={6} />
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>

      {/* Boutons sociaux */}
      <div className="divider">
        <span>ou</span>
      </div>
      
      <ButtonSocials />

      {/* Lien vers connexion */}
      <div className="link-to-login">
        Déjà un compte ?{" "}
        <Link href="/login">Connectez-vous ici</Link>.
      </div>
    </div>
  );
};

export default SignUpCard;
