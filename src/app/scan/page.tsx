"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import styles from "./CSS/BarcodeScanner.module.css";

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
          setLoading(false); // Caméra prête

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
      if (controlsRef.current) controlsRef.current.stop();
      try {
        codeReader.reset();
      } catch (err) {
        console.warn("Erreur lors du reset du codeReader :", err);
      }
    };
  }, []);

  const restartScan = () => {
    setResult(""); // Réinitialiser le résultat
    setLoading(true);
    const codeReader = new BrowserMultiFormatReader() as ExtendedBrowserMultiFormatReader;
    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
          setLoading(false);
          if (result) {
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
  };

  return (
    <div className={styles.container}>
      <div className={styles.scanner}>
        {loading && <div className={styles.loading}>Chargement de la caméra...</div>}
        <video ref={videoRef} className={styles.video} />
        {!loading && !result && <div className={styles.scanBox}></div>}
      </div>

      {result && (
        <div className={styles.resultContainer}>
          <p className={styles.resultText}>Résultat : <strong>{result}</strong></p>
          <button className={styles.retryButton} onClick={restartScan}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
