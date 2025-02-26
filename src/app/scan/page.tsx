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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<Controls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader() as ExtendedBrowserMultiFormatReader;

    // Démarrer le scan
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, error, controls) => {
        if (result) {
          setResult(result.getText());
          controlsRef.current = controls; // Stocker les contrôles
          controls.stop(); // Arrêter après la détection

          // Dessiner un cadre visuel autour du code détecté
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;
          const video = videoRef.current!;

          // Ajuster la taille du Canvas à la taille de la vidéo
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Effacer le Canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Dessiner un rectangle autour du code détecté
          const positions = result.getResultPoints();
          if (positions && positions.length > 0) {
            const firstPoint = positions[0]; // Prendre le premier point détecté
            const x = firstPoint.getX(); // Utiliser la méthode getX()
            const y = firstPoint.getY(); // Utiliser la méthode getY()
            console.log("Point détecté :", { x, y }); // Afficher les coordonnées dans la console
            ctx.strokeStyle = "green"; // Couleur du cadre
            ctx.lineWidth = 2; // Épaisseur du cadre
            ctx.strokeRect(x, y, 100, 100); // Dessiner un rectangle de 100x100 pixels
          } else {
            console.log("Aucun point détecté.");
          }
        }
        if (error) console.error("Erreur de caméra :", error);
      })
      .catch((err) => console.error("Erreur lors du démarrage de la caméra :", err));

    // Nettoyage
    return () => {
      if (controlsRef.current) controlsRef.current.stop(); // Arrêter la caméra
      codeReader.reset(); // Utiliser reset sans erreur de typage
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
