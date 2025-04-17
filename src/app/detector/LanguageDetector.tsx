"use client";

import { useState } from 'react';
import { franc } from 'franc-min';

interface LanguageDetectorProps {
  text: string;
}

const LanguageDetector: React.FC<LanguageDetectorProps> = ({ text }) => {
  const [language, setLanguage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fonction pour détecter la langue du texte
  const detectLanguage = (inputText: string) => {
    try {
      const lang = franc(inputText);
      if (lang === 'und') {
        setError('La langue n\'a pas pu être détectée.');
        setLanguage('');
      } else {
        setLanguage(lang);
        setError('');
      }
    } catch (err) {
      setError('Une erreur s\'est produite lors de la détection de la langue.');
      setLanguage('');
    }
  };

  // Appeler la fonction de détection chaque fois que le texte change
  if (text && text !== '') {
    detectLanguage(text);
  }

  return (
    <div>
      <h3>Détecteur de Langue</h3>
      <p>Texte : {text}</p>
      <p>Langue détectée : {language || 'Aucune'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LanguageDetector;
