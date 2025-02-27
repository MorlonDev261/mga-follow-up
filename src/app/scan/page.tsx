"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

// Étendre l'interface BrowserMultiFormatReader
interface ExtendedBrowserMultiFormatReader extends BrowserMultiFormatReader {
  reset: () => void;
}

type Controls = {
  stop: () => void;
};

export default function BarcodeScanner() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const resultRef = useRef<string>("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader() as ExtendedBrowserMultiFormatReader;

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
          setLoading(false); // La caméra est prête

          if (result && result.getText() !== resultRef.current) {
            resultRef.current = result.getText();
            setResult(result.getText());
            if (controls) {
              controlsRef.current = controls;
              controls.stop();
            }
          }
          if (error) console.error(error);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      try {
        codeReader.reset();
      } catch (err) {
        console.warn("Erreur lors du reset du codeReader :", err);
      }
    };
  }, []);

  return (
    <div>
      {loading && <p>Chargement de la caméra...</p>}
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      {result && <p>Résultat : {result}</p>}
    </div>
  );
}
