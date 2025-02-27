"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BsLightning, BsLightningFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineHistory } from "react-icons/md";

type Controls = {
  stop: () => void;
};

export default function BarcodeScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const resultRef = useRef<string>("");

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = () => {
    setLoading(true);
    const codeReader = new BrowserMultiFormatReader();
    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
          setLoading(false);

          if (result && result.getText() !== resultRef.current) {
            const scannedText = result.getText();
            resultRef.current = scannedText;
            setResult(scannedText);
            setHistory((prev) => [...prev, scannedText]);

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

  const stopScanner = () => {
    if (controlsRef.current) controlsRef.current.stop();
  };

  const restartScan = () => {
    setResult(null);
    startScanner();
  };

  const toggleFlash = () => {
    setFlash((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      {/* Scanner */}
      <div className="relative w-full h-60 bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {loading && <p className="absolute text-white text-lg">Chargement...</p>}
        <video ref={videoRef} className="w-full h-full z-10 object-cover" />
        {!loading && (
          <div className="absolute w-4/5 h-1/4 z-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
          </div>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={toggleFlash}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
        >
          {flash ? <BsLightningFill size={24} /> : <BsLightning size={24} />}
        </button>

        <button
          onClick={restartScan}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-all"
        >
          <IoMdRefresh size={24} />
          <span>Recommencer</span>
        </button>
      </div>

      {/* Résultat */}
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-md text-center w-full">
          <p className="text-lg font-semibold">Résultat :</p>
          <p className="text-gray-800 text-xl font-bold">{result}</p>
        </div>
      )}

      {/* Historique */}
      {history.length > 0 && (
        <div className="mt-4 w-full">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <MdOutlineHistory size={24} />
            <p>Historique :</p>
          </div>
          <ul className="mt-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-lg shadow">
            {history.slice(-5).reverse().map((item, index) => (
              <li key={index} className="p-2 border-b border-gray-200">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
