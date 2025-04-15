'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const save = async () => {
    await fetch('/api/ai/context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    });
    setQuestion('');
    setAnswer('');
    alert('Ajouté !');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter une réponse pour Degany</h1>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Question"
        className="w-full border p-2 mb-2"
      />
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Réponse"
        className="w-full border p-2 mb-4"
        rows={5}
      />
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
    </div>
  );
}
