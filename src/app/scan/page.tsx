"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Controls = {
  stop: () => void;
};

export default function BarcodeScanner() {
  const [result, setResult] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<Controls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Démarrer le scan
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, error, controls) => {
        if (result) {
          setResult(result.getText());
          controlsRef.current = controls; // Stocker les contrôles
          controls.stop(); // Arrêter après la détection
        }
        if (error) console.error(error);
      })
      .catch((err) => console.error(err));

    // Nettoyage
    return () => {
      if (controlsRef.current) controlsRef.current.stop(); // Arrêter la caméra
      codeReader.reset(); // Utilisation de la méthode reset
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      {result && <p>Résultat : {result}</p>}
    </div>
  );
}
