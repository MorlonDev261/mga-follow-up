"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";
import { cn } from "@/lib/utils";
import { BsLightning, BsLightningFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineHistory } from "react-icons/md";

type Controls = {
  stop: () => void;
};

interface TorchTrackConstraint extends MediaTrackConstraintSet {
  torch?: boolean;
}

export default function BarcodeScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isScanned, setIsScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const resultRef = useRef<string>("");

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = () => {
    setLoading(true);
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128]);

    const codeReader = new BrowserMultiFormatReader(hints);

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, _, controls) => {
          setLoading(false);

          if (result) {
            const scannedText = result.getText();

            // Vérifier si c'est un IMEI valide (15 chiffres)
            if (/^\d{15}$/.test(scannedText) && scannedText !== resultRef.current) {
              resultRef.current = scannedText;
              setResult(scannedText);
              setHistory((prev) => [...prev, scannedText]);

              if (controls) {
                controlsRef.current = controls;
                controls.stop();
              }
            }
          }
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

  const toggleFlash = async () => {
  if (!videoRef.current) return;

  const stream = videoRef.current.srcObject as MediaStream | null;
  if (!stream) return;

  const [track] = stream.getVideoTracks();
  if (!track) return;

  try {
    await track.applyConstraints({
      advanced: [{ torch: !flash } as TorchTrackConstraint],
    });
    setFlash((prev) => !prev);
  } catch (error) {
    console.error("Flash non supporté :", error);
  }
};


  const scanIndicatorArea = async () => {
  if (!videoRef.current) return;
  setIsScanned(false);

  const video = videoRef.current;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Définir la zone de l'indicateur
  const indicatorWidth = video.videoWidth * 0.8;
  const indicatorHeight = video.videoHeight * 0.25;
  const x = (video.videoWidth - indicatorWidth) / 2;
  const y = (video.videoHeight - indicatorHeight) / 2;

  // Ajuster le canvas
  canvas.width = indicatorWidth;
  canvas.height = indicatorHeight;

  // Capturer la zone de l'indicateur
  ctx.drawImage(video, x, y, indicatorWidth, indicatorHeight, 0, 0, indicatorWidth, indicatorHeight);

  // Convertir le canvas en image
  const image = new Image();
  image.src = canvas.toDataURL(); // Convertir en URL de données

  image.onload = async () => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128]);

    const codeReader = new BrowserMultiFormatReader(hints);
    try {
      const result = await codeReader.decodeFromImageElement(image);
      const scannedText = result.getText();

      if (scannedText == resultRef.current) {
        setIsScanned(true);
        return;
      }else {
        resultRef.current = scannedText;
        setResult(scannedText);
        setHistory((prev) => [...prev, scannedText]);
      }
    } catch (error) {
      console.warn("Aucun code détecté dans l’indicator :", error);
    }
  };
};


  // Scanner uniquement dans la zone de l'indicator toutes les secondes
  useEffect(() => {
    const interval = setInterval(scanIndicatorArea, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      {/* Scanner */}
      <div className="relative w-full h-60 bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {loading && <p className="absolute text-white text-lg">Loading...</p>}
        
        {!loading && !result && (
          <p className="absolute text-green-500 text-sm z-20 pointer-events-none">
            Place the barcode inside the indicator
          </p>
        )}

        {isScanned && (
          <p className="absolute bottom-6 text-yellow-500 text-lg z-20 pointer-events-none">
            This barcode is already scanned.
          </p>
        )}

        <video ref={videoRef} className="w-full h-full z-10 object-cover" />

        {!loading && (
          <div className="absolute w-4/5 h-1/4 z-20 pointer-events-none">
            <div className={cn("absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4", isScanned ? "border-yellow-500" : "border-green-500")}></div>
            <div className={cn("absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4", isScanned ? "border-yellow-500" : "border-green-500")}></div>
            <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4", isScanned ? "border-yellow-500" : "border-green-500")}></div>
            <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4", isScanned ? "border-yellow-500" : "border-green-500")}></div>
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
