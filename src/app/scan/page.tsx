"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Controls = {
  stop: () => void;
};

export default function BarcodeScanner() {
  const [result, setResult] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

          // Dessiner un rectangle autour du code détecté
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;
          const video = videoRef.current!;

          // Ajuster la taille du Canvas à la taille de la vidéo
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Effacer le canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Dessiner un rectangle autour du code détecté
          const positions = result.getResultPoints();
          if (positions && positions.length > 0) {
            const firstPoint = positions[0]; // Prendre le premier point détecté
            const x = firstPoint.getX(); // Utiliser la méthode getX()
            const y = firstPoint.getY(); // Utiliser la méthode getY()
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, 100, 100); // Ajuster la taille du rectangle selon vos besoins
          }
        }
        if (error) console.error(error);
      })
      .catch((err) => console.error(err));

    // Nettoyage
    return () => {
      if (controlsRef.current) controlsRef.current.stop(); // Arrêter la caméra
      codeReader.stopAsync(); // Utiliser stopAsync au lieu de reset
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "auto" }}>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Permettre les interactions avec la vidéo
        }}
      />
      {result && <p>Résultat : {result}</p>}
    </div>
  );
}
