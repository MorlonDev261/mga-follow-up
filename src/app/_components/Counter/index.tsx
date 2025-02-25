"use client";

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
  const [play, { stop }] = useSound(src, { volume });

  return (
    <div className="p-4 text-center bg-gray-900 text-white rounded-md">
      <h2 className="text-xl font-bold mb-2">Total Sales</h2>
      <p className="text-3xl font-extrabold">
        <CountUp
          start={start}
          end={end}
          duration={duration}
          separator=","
          onStart={() => {
            if (sound === "on") {
              play();
            }
          }}
          onEnd={() => {
            stop();
          }}
        />
      </p>
    </div>
  );
}
