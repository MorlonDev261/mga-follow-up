"use client";

import { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import CountUp from "react-countup";
import useSound from "use-sound";
import clsx from "clsx";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
  sound?: "on" | "off";
  src?: string;
  volume?: number;
}

export default function Counter({
  start = 0,
  end,
  duration = 2,
  sound = "off",
  src = "/sounds/default-count.mp3",
  volume = 1,
}: CounterProps) {
  const [key, setKey] = useState(Date.now());
  const [isCounting, setIsCounting] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [play, { stop }] = useSound(src, { volume });

  useEffect(() => {
    const enableAudio = () => setIsUserInteracted(true);
    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);
    
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, []);

  useEffect(() => {
    // Démarrage automatique du compteur au chargement (sans son)
    setKey(Date.now());
    setIsCounting(true);
  }, []);

  const handleRestart = () => {
    setKey(Date.now()); // Redémarrer le compteur
    setIsCounting(true); // Lancer l'animation
    if (sound === "on" && isUserInteracted) {
      play();
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Bouton actualisation avec animation */}
      <button
        onClick={handleRestart}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <FaSync className={clsx("w-6 h-6", isCounting && "animate-spin")} />
      </button>

      {/* Compteur animé */}
      <CountUp
        key={key}
        start={start}
        end={end}
        duration={duration}
        separator=","
        onStart={() => setIsCounting(true)}
        onEnd={() => {
          setIsCounting(false);
          stop();
        }}
      />
    </div>
  );
}
