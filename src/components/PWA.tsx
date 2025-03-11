'use client'

import { useEffect } from 'react';

export default function PWA() {
  useEffect(() => {
    // Vérifie si le navigateur supporte les Service Workers
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Enregistre le Service Worker
      navigator.serviceWorker
        .register('/sw.js') // Chemin vers le fichier Service Worker
        .then((registration) => {
          console.log('Service Worker enregistré avec succès :', registration);
        })
        .catch((error) => {
          console.error("Échec de l'enregistrement du Service Worker :", error);
        });
    }
  }, []); // Le tableau vide [] garantit que cela ne s'exécute qu'une fois

  return null; // Ce composant ne rend rien dans le DOM
}
