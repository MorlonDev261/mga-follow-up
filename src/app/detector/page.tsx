"use client";

import { useState } from 'react';
import LanguageDetector from './LanguageDetector';

const HomePage: React.FC = () => {
  const [text, setText] = useState<string>('');

  return (
    <div>
      <h1>Bienvenue sur le détecteur de langue</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tapez votre texte ici..."
        rows={4}
        cols={50}
      />
      <LanguageDetector text={text} />
    </div>
  );
};

export default HomePage;
