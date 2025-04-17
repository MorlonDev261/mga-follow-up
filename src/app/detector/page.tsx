"use client";

import { useState, useEffect } from 'react';
import { franc } from 'franc-min';

interface LanguageDetectorProps {
  text: string;
}

const LanguageDetector: React.FC<LanguageDetectorProps> = ({ text }) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (text.trim() !== '') {
      try {
        const detectedLang = franc(text);
        if (detectedLang === 'und') {
          setError('La langue n\'a pas pu être détectée.');
          setLanguage(null);
        } else {
          setLanguage(detectedLang);
          setError('');
        }
      } catch (err) {
        setError('Une erreur s\'est produite lors de la détection de la langue.');
        setLanguage(null);
      }
    } else {
      setLanguage(null);
      setError('');
    }
  }, [text]); // Effect hook pour réagir aux changements de texte

  return (
    <div>
      <p>Texte : {text}</p>
      <p>Langue détectée : {language ? language : 'Aucune'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LanguageDetector;
