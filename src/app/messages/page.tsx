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
    { id: "1", name: "Alice", avatar: "/avatar1.png", lastMessage: "Hello!", lastMessageTimestamp: Date.now() - 1000 * 60 * 2, unread: 2 },
    { id: "2", name: "Bob", avatar: "/avatar2.png", lastMessage: "À plus tard.", lastMessageTimestamp: Date.now() - 1000 * 60 * 10, unread: 0 },
    { id: "3", name: "Charlie", avatar: "/avatar3.png", lastMessage: "Ok, c'est noté.", lastMessageTimestamp: Date.now() - 1000 * 60 * 30, unread: 1 },
    { id: "4", name: "David", avatar: "/avatar4.png", lastMessage: "Bonne nuit !", lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 5, unread: 4 },
    { id: "5", name: "Emma", avatar: "/avatar5.png", lastMessage: "Je suis en route.", lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24, unread: 0 },
    { id: "6", name: "François", avatar: "/avatar6.png", lastMessage: "Appelle-moi dès que possible.", lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 48, unread: 3 },
    { id: "7", name: "Sophie", avatar: "/avatar7.png", lastMessage: "C'était super hier !", lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 72, unread: 1 },
  ];

  const messages = [
    { id: "msg1", text: "Salut, comment ça va ?", timestamp: new Date("2025-03-12T10:30:00Z"), isOwn: false, senderId: "user_2", chatId: "1", read: true, avatar: "/avatars/user2.png" },
    { id: "msg2", text: "Ça va bien, merci ! Et toi ?", timestamp: new Date("2025-03-12T10:32:00Z"), isOwn: true, senderId: "user_1", chatId: "1", read: true, avatar: "/avatars/user1.png" },
    { id: "msg3", text: "Je vais bien aussi, merci 😊", timestamp: new Date("2025-03-12T10:35:00Z"), isOwn: false, senderId: "user_2", chatId: "1", read: false, avatar: "/avatars/user2.png" },
  ];

  const renderMobileView = () => {
    if (view === "list") {
      return <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />;
    }

    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return null; // Sécurité si `selectedChat` est null

    return (
      <div className="h-screen flex flex-col">
        <ChatHeader chat={chat} onBack={handleBack} />
        <MessageList messages={messages.filter(m => m.chatId === selectedChat)} />
        <MessageInput onSend={(msg) => console.log(msg)} />
      </div>
    );
  };

  return (
    <div className={`h-screen ${isDesktop ? "flex" : "flex flex-col"}`}>
      {isDesktop ? (
        <>
          <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
          <div className="flex-1">
            {selectedChat ? (
              <>
                <ChatHeader chat={chats.find(c => c.id === selectedChat)} />
                <MessageList messages={messages.filter(m => m.chatId === selectedChat)} />
                <MessageInput onSend={(msg) => console.log(msg)} />
              </>
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                Sélectionnez une conversation
              </div>
            )}
          </div>
        </>
      ) : (
        renderMobileView()
      )}
    </div>
  );
};

export default Messenger;
