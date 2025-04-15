'use client';
import { useState, useRef, useEffect } from 'react';
import { IoSend, IoRefresh } from 'react-icons/io5';
import { FiUser, FiMessageSquare } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';

export default function Chat() {
  const [messages, setMessages] = useState<{ user: string; bot: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getFormattedTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setIsLoading(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { 
      user: userMessage, 
      bot: '', 
      timestamp: getFormattedTime() 
    }]);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      
      // Update with bot response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].bot = data.answer;
        return newMessages;
      });
    } catch (error) {
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <RiRobot2Line size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Assistant IA</h1>
              <p className="text-xs text-gray-500">Propulsé par Together.ai</p>
            </div>
          </div>
          <button 
            onClick={resetConversation}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            title="Réinitialiser la conversation"
          >
            <IoRefresh size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <RiRobot2Line size={48} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">Comment puis-je vous aider aujourd&apos;hui ?</h2>
            <p className="max-w-md text-sm">
              Posez-moi n&apos;importe quelle question et je ferai de mon mieux pour vous répondre.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  <FiUser size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">Vous</span>
                    <span className="text-xs text-gray-400">{m.timestamp}</span>
                  </div>
                  <div className="mt-1 text-gray-700 bg-gray-100 p-3 rounded-lg rounded-tl-none">
                    {m.user}
                  </div>
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 p-2 rounded-full">
                  <RiRobot2Line size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">Assistant</span>
                    <span className="text-xs text-gray-400">{m.timestamp}</span>
                  </div>
                  <div className="mt-1 text-gray-700 bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                    {m.bot || (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-300"></div>
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
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
