"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
};

export const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-3",
            message.isOwn ? "justify-end" : "justify-start"
          )}
        >
          {!message.isOwn && (
            <Avatar className="mt-1">
              <AvatarImage src={message.avatar} />
            </Avatar>
          )}
          
          <div
            className={cn(
              "max-w-[70%] rounded-xl p-3",
              message.isOwn
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 dark:bg-gray-800"
            )}
          >
            <p>{message.text}</p>
            <div className="flex justify-end mt-2">
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
