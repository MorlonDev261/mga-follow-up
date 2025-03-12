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
  
  // Mock data
  const chats = [
    {
      id: "1",
      name: "Alice",
      avatar: "/avatar1.png",
      lastMessage: "Hello!",
      lastMessageTimestamp: Date.now(), // Assurer un timestamp valide
      unread: 2,
    },
  ];

  const messages [
    {
      id: "msg1",
      text: "Salut, comment ça va ?",
      timestamp: new Date("2025-03-12T10:30:00Z"),
      isOwn: false,
      senderId: "user_2",
      chatId: "chat_1",
      read: true,
      avatar: "/avatars/user2.png",
    },
    {
      id: "msg2",
      text: "Ça va bien, merci ! Et toi ?",
      timestamp: new Date("2025-03-12T10:32:00Z"),
      isOwn: true,
      senderId: "user_1",
      chatId: "chat_1",
      read: true,
      avatar: "/avatars/user1.png",
    },
    {
      id: "msg3",
      text: "Je vais bien aussi, merci 😊",
      timestamp: new Date("2025-03-12T10:35:00Z"),
      isOwn: false,
      senderId: "user_2",
      chatId: "chat_1",
      read: false,
      avatar: "/avatars/user2.png",
    },
];

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

export default Messenger;
