"use client";
import { useState } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import ChatList from "./_components/ChatList";
import MessageList from "./_components/MessageList";
import ChatHeader from "./_components/ChatHeader";
import MessageInput from "./_components/MessageInput";

const Messenger = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { isDesktop } = useMediaQuery();
  const [view, setView] = useState<"list" | "chat">("list");

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setView("chat");
  };

  const handleBack = () => {
    setSelectedChat(null);
    setView("list");
  };

  // Mock data
  const chats = [
    { id: "1", name: "Alice", avatar: "/avatar/avatar1.png", lastMessage: "Hello!", unread: 2 },
    { id: "2", name: "Bob", avatar: "/avatar/avatar2.png", lastMessage: "À plus tard.", unread: 0 },
  ];

  const messages = [
    { id: "msg1", text: "Salut", chatId: "1", isOwn: false, timestamp: new Date() },
    { id: "msg2", text: "Ça va ?", chatId: "1", isOwn: true, timestamp: new Date() },
  ];

  return (
    <div className="h-screen flex">
      {/* ChatList toujours visible */}
      <div className="w-[350px] border-r border-gray-200">
        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
      </div>

      {/* Affichage des messages si un chat est sélectionné */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader chat={chats.find(c => c.id === selectedChat)!} />
            <MessageList messages={messages.filter(m => m.chatId === selectedChat)} />
            <MessageInput onSend={(msg) => console.log(msg)} />
          </>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
