import { useState } from 'react';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Veuillez entrer un message.");
      return;
    }

    try {
      const res = await fetch('/api/ai/assistant, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Échec de l\'appel à l\'API');
      }

      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      console.error('Erreur:', error);
      setResponse('Une erreur est survenue lors de l\'appel à l\'API.');
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tapez votre message..."
        rows={4}
      />
      <button onClick={sendMessage}>Envoyer</button>

      {response && <p><strong>Réponse:</strong> {response}</p>}
    </div>
  );
};

export default ChatComponent;
