"use client";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChatList } from "./_components/ChatList";
import { MessageList } from "./_components/MessageList";
import { ChatHeader } from "./_components/ChatHeader";
import { MessageInput } from "./_components/MessageInput";

export const MainLayout = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  // Mock data
  const chats = [...];
  const messages = [...];

  if (!isDesktop && selectedChat) {
    return (
      <div className="h-screen flex flex-col">
        <ChatHeader chat={chats.find(c => c.id === selectedChat)} />
        <MessageList messages={messages} />
        <MessageInput onSend={(msg) => console.log(msg)} />
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <ChatList 
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader chat={chats.find(c => c.id === selectedChat)} />
        <MessageList messages={messages} />
        <MessageInput onSend={(msg) => console.log(msg)} />
      </div>
    </div>
  );
};
