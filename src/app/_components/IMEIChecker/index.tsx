'use client';

import { useState } from 'react';

export default function ImeiChecker() {
  const [imei, setImei] = useState('');

  const handleCheck = () => {
    console.log(`Checking IMEI: ${imei}`);
    // Ajouter ici la logique de vérification de l'IMEI
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-cyan-300">Check IMEI to</h1>
      <h2 className="text-4xl font-bold text-center text-cyan-300">know your phone better</h2>
      <p className="text-center text-white mt-4 max-w-md">
        Every device has a unique 15-digit IMEI number. Based on this number, we can provide additional
        information about your device.
      </p>
      <p className="text-center text-white mt-2">
        Please enter your IMEI number and check for yourself.
      </p>
      
      <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-green-700">
        IMEI WHAT IS IT ?
      </button>
      
      <input
        type="text"
        placeholder="IMEI"
        value={imei}
        onChange={(e) => setImei(e.target.value)}
        className="mt-4 w-full max-w-md px-4 py-2 rounded-lg text-black outline-none border border-gray-300 focus:ring-2 focus:ring-cyan-300"
      />
      
      <button
        onClick={handleCheck}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-600"
      >
        CHECK
      </button>
    </div>
  );
}
