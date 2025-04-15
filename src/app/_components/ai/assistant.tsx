 'use client';
import { useState, useRef } from 'react';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { BsMicFill } from 'react-icons/bs';

type Message = {
  from: 'user' | 'degany';
  text: string;
};

export default function ChatDegany() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { from: 'user', text: userMessage },
      { from: 'degany', text: '...' },
    ]);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data: { answer?: string } = await res.json();
      const answer = data.answer || 'Je ne suis pas autorisé à répondre à cela.';

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: 'degany', text: answer },
      ]);

      const utter = new SpeechSynthesisUtterance(answer);
      utter.lang = 'fr-FR';
      synthRef.current?.speak(utter);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: 'degany', text: 'Erreur de connexion.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as typeof window & {
            webkitSpeechRecognition?: typeof SpeechRecognition;
          }).SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      alert('Micro non supporté');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold text-center text-blue-700">
        Degany – Assistant MGA
      </h2>

      <div className="h-[400px] overflow-y-auto space-y-2 bg-gray-50 p-4 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[80%]">
              {m.from === 'degany' && (
                <FaRobot size={28} className="text-blue-600" />
              )}
              <div
                className={`p-3 text-sm rounded-xl shadow ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              {m.from === 'user' && (
                <FaUserCircle size={28} className="text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={startListening}
          className={`p-2 rounded bg-gray-200 hover:bg-gray-300 ${
            listening ? 'animate-pulse' : ''
          }`}
          title="Activer le micro"
        >
          <BsMicFill className="text-blue-600" size={20} />
        </button>
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question ici..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
