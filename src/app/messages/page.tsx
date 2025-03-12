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
  {
    id: "1",
    name: "Alice",
    avatar: "/avatar/avatar1.png",
    lastMessage: "Hello!",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 2, // Il y a 2 minutes
    unread: 2,
  },
  {
    id: "2",
    name: "Bob",
    avatar: "/avatar/avatar2.png",
    lastMessage: "À plus tard.",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 10, // Il y a 10 minutes
    unread: 0,
  },
  {
    id: "3",
    name: "Charlie",
    avatar: "/avatar/avatar3.png",
    lastMessage: "Ok, c'est noté.",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 30, // Il y a 30 minutes
    unread: 1,
  },
  {
    id: "4",
    name: "David",
    avatar: "/avatar/avatar4.png",
    lastMessage: "Bonne nuit !",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 5, // Il y a 5 heures
    unread: 4,
  },
  {
    id: "5",
    name: "Emma",
    avatar: "/avatar/avatar5.png",
    lastMessage: "Je suis en route.",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24, // Hier
    unread: 0,
  },
  {
    id: "6",
    name: "François",
    avatar: "/avatar/avatar6.png",
    lastMessage: "Appelle-moi dès que possible.",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 48, // Il y a 2 jours
    unread: 3,
  },
  {
    id: "7",
    name: "Sophie",
    avatar: "/avatar/avatar7.png",
    lastMessage: "C'était super hier !",
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 72, // Il y a 3 jours
    unread: 1,
  },
];

  const messages = [
  {
    id: "msg1",
    text: "Salut, comment ça va ?",
    timestamp: new Date("2025-03-12T10:30:00Z"),
    isOwn: false,
    senderId: "user_2",
    chatId: "1",
    read: true,
    avatar: "/avatar/avatar2.png",
  },
  {
    id: "msg2",
    text: "Ça va bien, merci ! Et toi ?",
    timestamp: new Date("2025-03-12T10:32:00Z"),
    isOwn: true,
    senderId: "user_1",
    chatId: "1",
    read: true,
    avatar: "/avatar/avatar1.png",
  },
  {
    id: "msg3",
    text: "Je vais bien aussi, merci 😊",
    timestamp: new Date("2025-03-12T10:35:00Z"),
    isOwn: false,
    senderId: "user_2",
    chatId: "1",
    read: false,
    avatar: "/avatar/avatar2.png",
  },
  {
    id: "msg4",
    text: "On se voit ce soir ?",
    timestamp: new Date("2025-03-12T12:00:00Z"),
    isOwn: false,
    senderId: "user_3",
    chatId: "2",
    read: false,
    avatar: "/avatar/avatar3.png",
  },
  {
    id: "msg5",
    text: "Oui, vers 19h !",
    timestamp: new Date("2025-03-12T12:05:00Z"),
    isOwn: true,
    senderId: "user_1",
    chatId: "2",
    read: true,
    avatar: "/avatar/avatar1.png",
  },
  {
    id: "msg6",
    text: "Parfait, à tout à l’heure !",
    timestamp: new Date("2025-03-12T12:10:00Z"),
    isOwn: false,
    senderId: "user_3",
    chatId: "2",
    read: false,
    avatar: "/avatar/avatar3.png",
  },
  {
    id: "msg7",
    text: "Tu as vu le match hier soir ?",
    timestamp: new Date("2025-03-11T20:45:00Z"),
    isOwn: false,
    senderId: "user_4",
    chatId: "3",
    read: true,
    avatar: "/avatar/avatar4.png",
  },
  {
    id: "msg8",
    text: "Oui, c'était incroyable !",
    timestamp: new Date("2025-03-11T20:50:00Z"),
    isOwn: true,
    senderId: "user_1",
    chatId: "3",
    read: true,
    avatar: "/avatar/avatar1.png",
  },
  {
    id: "msg9",
    text: "On en parle demain au café ?",
    timestamp: new Date("2025-03-11T21:00:00Z"),
    isOwn: false,
    senderId: "user_4",
    chatId: "3",
    read: false,
    avatar: "/avatar/avatar4.png",
  },
  {
    id: "msg10",
    text: "Bien sûr, 10h ça te va ?",
    timestamp: new Date("2025-03-11T21:05:00Z"),
    isOwn: true,
    senderId: "user_1",
    chatId: "3",
    read: false,
    avatar: "/avatar/avatar1.png",
  },
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
          <div className="">
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
