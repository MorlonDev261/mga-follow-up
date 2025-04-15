'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, SendHorizonal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Chatbot() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsChatOpen((prev) => !prev)

  const handleSend = () => {
    if (!input.trim()) return
    const newMessage = { text: input, isUser: true }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
    // simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: input, isUser: true },
        { text: "Ceci est une réponse automatique", isUser: false },
      ])
    }, 600)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isChatOpen])

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 sm:bottom-4 sm:right-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110"
        aria-label="Ouvrir le chat"
      >
        <Bot className="w-6 h-6" />
      </button>

      <div
        className={`fixed bottom-0 right-0 left-0 md:bottom-24 md:right-6 md:left-auto w-full md:w-96 h-full md:h-4/5 md:max-h-[600px] bg-gray-50 rounded-none md:rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform ${
          isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        } z-40`}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <span className="font-bold text-lg">Assistant</span>
          <button onClick={toggleChat} aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-xs md:max-w-sm text-sm ${
                msg.isUser ? 'ml-auto bg-green-100' : 'mr-auto bg-white'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </ScrollArea>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message ici..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SendHorizonal className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
