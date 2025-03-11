"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Download = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsMobile(/Mobi|Android/i.test(userAgent));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStandalone = "standalone" in window.navigator && (window.navigator as any).standalone;
    setIsIOS(/iPhone|iPad|iPod/i.test(userAgent) && !isStandalone);

    // Capturer l'événement pour Android
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("L'utilisateur a installé la PWA");
    } else {
      console.log("L'utilisateur a annulé l'installation");
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="flex flex-col items-center">
      {!isIOS && (
        <button
          onClick={handleInstall}
          disabled={!deferredPrompt}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {isMobile ? "📱 Télécharger l'application" : "💻 Télécharger le logiciel"}
        </button>
      )}

      {isIOS && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-center mt-2">
          📌 <strong>iOS :</strong> Pour installer l&apos;application, ouvre Safari et  
          <br /> appuie sur <strong>Partager</strong> (icône 🔗) puis  
          <br /> sélectionne <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong>.
        </div>
      )}
    </div>
  );
};

export default Download;
