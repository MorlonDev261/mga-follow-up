"use client";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Démarrer le décodage depuis le périphérique vidéo
    codeReader
      .decodeFromVideoDevice(undefined, "video", (result, error, controls) => {
        if (result) {
          setResult(result.getText());
          controls.stop(); // Arrêter le scan et éteindre la caméra
        }
        if (error) {
          console.error(error);
        }
      })
      .catch((err) => console.error(err));

    // Nettoyage lors du démontage du composant
    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <video id="video" style={{ width: "100%" }} />
      {result && <p>Scanned: {result}</p>}
    </div>
  );
}
