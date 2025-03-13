"use client";

import { useEffect, useState } from "react";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { FaLaptop } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Download = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Détection de l'environnement
    const userAgent = navigator.userAgent;
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    setIsMobile(isMobileDevice);
    setIsIOS(isIOSDevice && !isStandalone);
    setIsInstalled(isStandalone);

    // Capturer l'événement pour Android
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Vérifier si l'application est déjà installée
    const handleAppInstalled = () => setIsInstalled(true);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("L'utilisateur a installé la PWA");
      } else {
        console.log("L'utilisateur a annulé l'installation");
      }
    } catch (error) {
      console.error("Erreur lors de l'installation", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Bouton d'installation pour Android */}
      {!isIOS && !isInstalled && (
        <button
          onClick={handleInstall}
          disabled={!deferredPrompt}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {isMobile ? (<HiDevicePhoneMobile /> Télécharger l'application) : (<FaLaptop /> Télécharger le logiciel)}
        </button>
      )}

      {/* Instructions pour iOS */}
      {isIOS && !isInstalled && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-center mt-2">
          📌 <strong>iOS :</strong> Pour installer l&apos;application, ouvre Safari et  
          <br /> appuie sur <strong>Partager</strong> (icône 🔗) puis  
          <br /> sélectionne <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong>.
        </div>
      )}

      {/* Message si l'application est déjà installée */}
      {isInstalled && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md text-center mt-2">
          <IoMdCheckmarkCircleOutline /> L&apos;application est déjà installée sur votre appareil.
        </div>
      )}
    </div>
  );
};

export default Download;
