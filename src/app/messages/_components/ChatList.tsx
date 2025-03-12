"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosArrowBack, IoMdMore } from "react-icons/io";
import { Card } from "@/components/ui/card";
import { Chat } from "@/lib/types";

const ChatList = ({
  chats,
  selectedChat,
  onSelectChat,
}: {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}) => {
  return (
    <Card className="h-full rounded-none border-r-0 w-full md:w-80 overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 px-2">
        <IoIosArrowBack />
        <h2>Discussion</h2>
        <IoMdMore />
      </div>
      <div className="p-2 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
              selectedChat === chat.id 
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Avatar className="mr-3">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(chat.lastMessageTimestamp).toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default ChatList;
