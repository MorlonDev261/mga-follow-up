'use client';
import { useState, useRef } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';

export default function Chat() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { user: currentInput, bot: '...' }]);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await res.json();
      const botAnswer = data.answer || "Je n’ai pas compris.";

      setMessages(prev => [
        ...prev.slice(0, -1),
        { user: currentInput, bot: botAnswer }
      ]);

      // Lecture vocale
      const utter = new SpeechSynthesisUtterance(botAnswer);
      utter.lang = 'fr-FR';
      synthRef.current?.speak(utter);
    } catch (err) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { user: currentInput, bot: "Erreur de connexion au serveur." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center text-blue-700">Assistant Degany</h1>

      {/* Zone de chat */}
      <div className="bg-gray-100 rounded-lg p-6 space-y-4 h-[400px] overflow-y-auto shadow-lg border border-gray-300">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.user === '...' ? 'justify-center' : m.user ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-xs ${m.user ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'}`}
            >
              <p className="font-semibold">{m.user ? 'Toi' : 'Degany'} :</p>
              <p>{m.bot}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center">
            <p className="text-gray-500 italic">Degany est en train de réfléchir...</p>
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pose ta question ici..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          <FaRegPaperPlane className="text-lg" />
        </button>
      </div>
    </div>
  );
}
