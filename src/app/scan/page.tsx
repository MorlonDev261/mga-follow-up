"use client";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Utilisation de la méthode correcte `decodeFromVideoDevice`
    codeReader
      .decodeFromVideoDevice(undefined, "video", (result, err) => {
        if (result) {
          setResult(result.getText());
          codeReader.reset(); // Arrêter après le scan
        }
        if (err) {
          console.error(err);
        }
      })
      .catch((err) => console.error(err));

    return () => {
      codeReader.reset(); // Nettoyage à la fermeture du composant
    };
  }, []);

  return (
    <div>
      <video id="video" style={{ width: "100%" }} />
      {result && <p>Scanned: {result}</p>}
    </div>
  );
}
