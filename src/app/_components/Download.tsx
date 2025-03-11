"use client";

import { useEffect, useState } from "react";

const Download = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsMobile(/Mobi|Android/i.test(userAgent));
    setIsIOS(/iPhone|iPad|iPod/i.test(userAgent) && !window.navigator.standalone);

    // Capturer l'événement pour Android
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // @ts-ignore : TypeScript ne connaît pas ce type d'événement
    deferredPrompt.prompt();
    const choiceResult = await (deferredPrompt as any).userChoice;
    
    if (choiceResult.outcome === "accepted") {
      console.log("L'utilisateur a installé la PWA");
    } else {
      console.log("L'utilisateur a annulé l'installation");
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Bouton pour Android et Desktop */}
      {!isIOS && (
        <button
          onClick={handleInstall}
          disabled={!deferredPrompt}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {isMobile ? "📱 Télécharger l'application" : "💻 Télécharger le logiciel"}
        </button>
      )}

      {/* Message pour iOS */}
      {isIOS && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-center mt-2">
          📌 <strong>iOS :</strong> Pour installer l'application, ouvre Safari et  
          <br /> appuie sur <strong>Partager</strong> (icône 🔗) puis  
          <br /> sélectionne <strong>"Ajouter à l'écran d'accueil"</strong>.
        </div>
      )}
    </div>
  );
};

export default Download;
