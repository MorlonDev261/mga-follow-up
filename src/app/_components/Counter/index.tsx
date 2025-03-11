"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import useSound from "use-sound";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
  sound?: "on" | "off"; // Activer ou désactiver le son
  src?: string; // Chemin du fichier audio
  volume?: number; // Volume du son (0 - 1)
}

export default function Counter({
  start = 0,
  end,
  duration = 2,
  sound = "off",
  src = "/sounds/default-count.mp3",
  volume = 1,
}: CounterProps) {
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

  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      separator=","
      onStart={() => {
        if (sound === "on" && isUserInteracted) {
          play();
        }
      }}
      onEnd={() => {
        stop();
      }}
    />
  );
}
