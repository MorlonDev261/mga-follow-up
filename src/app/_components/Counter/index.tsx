"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import useSound from "use-sound";

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
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [play, { stop, sound: soundInstance }] = useSound(src, { volume });

  useEffect(() => {
    const enableAudio = () => {
      setIsUserInteracted(true);

      // Vérifier si l'AudioContext existe et le reprendre
      if (soundInstance?._ctx && soundInstance._ctx.state === "suspended") {
        soundInstance._ctx.resume();
      }
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, [soundInstance]);

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
