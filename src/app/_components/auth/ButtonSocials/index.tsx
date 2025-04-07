"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const ButtonSocials: React.FC = ({ isPending }: { isPending: boolean }) => {
  const [loading, setLoading] = useState({
    google: false,
    github: false,
  });

  const handleAuth = async (provider: "google" | "github") => {
    if (isPending) return;
    
    setLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      await signIn(provider, { callbackUrl: "/" });
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="flex items-center gap-2" onClick={() => handleAuth("google")}>
        {loading.google ? <Spinner size="sm" /> : <FcGoogle />}
        Continuer avec Google
      </Button>

      <Button variant="outline" className="flex items-center gap-2" onClick={() => handleAuth("github")}>
        {loading.github ? <Spinner size="sm" /> : <FaGithub />}
        Continuer avec GitHub
      </Button>
    </div>
  );
};

export default ButtonSocials;
