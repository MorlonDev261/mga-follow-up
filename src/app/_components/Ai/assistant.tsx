'use client';
import { useState, useRef, useEffect } from 'react';
import { IoSend, IoRefresh, IoClose, IoChatbubbleEllipses } from 'react-icons/io5';
import { FiUser, FiMessageSquare } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface Message {
  user: string;
  bot: string;
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const getFormattedTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Ajout immédiat du message de l'utilisateur
    setMessages(prev => [
      ...prev,
      {
        user: userMessage,
        bot: '',
        timestamp: getFormattedTime(),
      },
    ]);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Mise à jour du dernier message avec la réponse du bot
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].bot = data.answer;
        return newMessages;
      });
    } catch (error) {
      // Si une erreur survient, afficher un message d'erreur
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].bot = "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-[1000] transition-all duration-300 transform hover:scale-110"
        aria-label="Ouvrir le chat"
      >
        {isChatOpen ? (
          <IoClose size={24} />
        ) : (
          <IoChatbubbleEllipses size={24} />
        )}
      </button>

      {/* Chat Window */}
      <motion.div
        className={cn(
          "fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6", // plein écran mobile, positionné en bas à droite en desktop
          "w-full sm:w-96", // pleine largeur mobile, 384px sur desktop
          "h-full sm:max-h-[600px]", // pleine hauteur mobile, max hauteur sur desktop
          "bg-gray-50 rounded-none sm:rounded-xl", // pas d’arrondi sur mobile, arrondi desktop
          "shadow-2xl overflow-hidden flex flex-col z-[999]"
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isChatOpen ? 1 : 0, scale: isChatOpen ? 1 : 0.95 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <RiRobot2Line size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Assistant Degany</h1>
                <p className="text-xs text-gray-500">Assistant de MGA Follow UP</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetConversation}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Réinitialiser la conversation"
              >
                <IoRefresh size={20} />
              </button>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Fermer le chat"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <RiRobot2Line size={48} className="text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-700">Comment puis-je vous aider aujourd&apos;hui ?</h2>
              <p className="max-w-md text-sm">
                Posez-moi n&apos;importe quelle question et je ferai de mon mieux pour vous répondre.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="space-y-4">
                {/* User Message - Now on the right side */}
                <div className="flex justify-end">
                  <div className="max-w-3/4">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-xs text-gray-400">{m.timestamp}</span>
                      <span className="font-medium text-gray-800">Zah</span>
                    </div>
                    <div className="mt-1 text-white bg-orange-600 p-3 rounded-lg rounded-tr-none">
                      {m.user}
                    </div>
                  </div>
                  <div className="ml-3 mt-auto">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <FiUser size={18} className="text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Bot Message - Still on the left */}
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 p-2 rounded-full">
                    <RiRobot2Line size={18} className="text-white" />
                  </div>
                  <div className="flex-1 max-w-3/4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">Degany</span>
                      <span className="text-xs text-gray-400">{m.timestamp}</span>
                    </div>
                    <div className="mt-1 text-gray-700 bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                      {m.bot || (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-150"></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-300"></div>
                          <span className="text-sm text-gray-500">En train de réfléchir...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question ici..."
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiMessageSquare size={18} />
              </div>
            </div>
            <button
              className={`p-3 rounded-lg flex items-center justify-center ${
                input.trim() && !isLoading 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
