'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, { user: input, bot: data.answer }]);
    setInput('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Assistant IA (Together.ai)</h1>
      <div className="bg-gray-100 rounded p-4 space-y-4 h-[400px] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="space-y-1">
            <p><span className="font-semibold">Toi :</span> {m.user}</p>
            <p><span className="font-semibold">Assistant :</span> {m.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pose ta question ici..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
