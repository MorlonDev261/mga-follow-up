"use client";

import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaWindowMinimize, FaWindowMaximize, FaMicrophone } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';

// Types pour nos messages
type MessageType = 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effet pour scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputMessage,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    const response = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: inputMessage,
        history: messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('La connexion avec l\'assistant a échoué');
    }

    const data = await response.json();
    console.log('Réponse de l\'assistant:', data);  // Vérifiez ici la réponse de l'API

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: data.response,  // Vérifiez que cette donnée existe et est valide
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

  } catch (error) {
    console.error('Erreur lors de la communication avec l\'assistant:', error);

    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Désolé, j\'ai rencontré un problème. Pourriez-vous réessayer?',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bouton d'ouverture */}
      {!isOpen && (
        <button
          onClick={toggleAssistant}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300"
          aria-label="Ouvrir l'assistant"
        >
          <BiMessageDetail size={24} />
        </button>
      )}

      {/* Interface de l'assistant */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 md:w-96 border border-gray-200 transition-all duration-300">
          {/* En-tête */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRobot size={18} />
              <h3 className="font-medium">Assistant Virtuel</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleMinimize} 
                className="hover:bg-blue-700 p-1 rounded"
                aria-label={isMinimized ? "Maximiser" : "Minimiser"}
              >
                {isMinimized ? <FaWindowMaximize size={14} /> : <FaWindowMinimize size={14} />}
              </button>
              <button 
                onClick={toggleAssistant} 
                className="hover:bg-blue-700 p-1 rounded"
                aria-label="Fermer"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Corps de l'assistant */}
          {!isMinimized && (
            <>
              {/* Zone de messages */}
              <div className="flex-1 p-3 overflow-y-auto h-96 bg-gray-50">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-200 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-4 rounded-lg rounded-tl-none flex items-center">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
                      rows={1}
                    />
                  </div>
                  <button
                    onClick={() => {}}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                    aria-label="Activer le microphone"
                  >
                    <FaMicrophone size={18} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`p-2 rounded-full ${
                      !inputMessage.trim() || isLoading
                        ? 'bg-gray-300 text-gray-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    aria-label="Envoyer le message"
                  >
                    <FaPaperPlane size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Styles pour l'animation de l'indicateur de frappe */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #606060;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.5s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% {
            transform: translateY(0px);
            background-color: #9e9e9e;
          }
          28% {
            transform: translateY(-5px);
            background-color: #606060;
          }
          44% {
            transform: translateY(0px);
            background-color: #9e9e9e;
          }
        }
      `}</style>
    </div>
  );
}
