'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Ajout d'état pour gérer le chargement
  const [error, setError] = useState(''); // Ajout d'état pour les erreurs

  const save = async () => {
    if (!question || !answer) {
      setError('La question et la réponse sont obligatoires.');
      return;
    }

    setIsLoading(true); // Début du chargement
    setError(''); // Réinitialiser les erreurs
    try {
      const response = await fetch('/api/ai/trainning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer })
      });

      if (!response.ok) {
        throw new Error('Échec de l\'ajout');
      }

      setQuestion('');
      setAnswer('');
      alert('Ajouté !');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout de la question/réponse.');
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter une réponse pour Degany</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Affichage de l'erreur */}

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
      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isLoading} // Désactivation du bouton pendant le chargement
      >
        {isLoading ? 'Enregistrement...' : 'Enregistrer'} {/* Texte dynamique selon l'état de chargement */}
      </button>
    </div>
  );
}
