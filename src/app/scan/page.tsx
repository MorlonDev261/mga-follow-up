"use client";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromInputVideoDevice(undefined, "video")
      .then((res) => setResult(res.text))
      .catch((err) => console.error(err));

    return () => codeReader.reset();
  }, []);

  return (
    <div>
      <video id="video" style={{ width: "100%" }} />
      {result && <p>Scanned: {result}</p>}
    </div>
  );
}
