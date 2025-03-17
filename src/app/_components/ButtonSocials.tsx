"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FaGoogle, FaLinkedin, FaMicrosoft } from "react-icons/fa";

const ButtonSocials: React.FC = () => {
  const [loading, setLoading] = useState({
    google: false,
    linkedin: false,
    outlook: false,
  });

  const handleAuth = (provider: "google" | "linkedin" | "outlook") => {
    setLoading((prev) => ({ ...prev, [provider]: true }));

    setTimeout(() => {
      console.log(`Authentification via ${provider}`);
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="flex items-center gap-2" onClick={() => handleAuth("google")}>
        {loading.google ? <Spinner size="sm" /> : <FaGoogle />}
        Continuer avec Google
      </Button>

      <Button variant="outline" className="flex items-center gap-2" onClick={() => handleAuth("linkedin")}>
        {loading.linkedin ? <Spinner size="sm" /> : <FaLinkedin />}
        Continuer avec LinkedIn
      </Button>

      <Button variant="outline" className="flex items-center gap-2" onClick={() => handleAuth("outlook")}>
        {loading.outlook ? <Spinner size="sm" /> : <FaMicrosoft />}
        Continuer avec Outlook
      </Button>
    </div>
  );
};

export default ButtonSocials;
