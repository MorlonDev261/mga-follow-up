"use client";

import { useBgAnime } from "@/hooks/use-bg-anime";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
};

const MessageList = memo(({ messages }: { messages: Message[] }) => {
  useBackgroundAnimation("bg-animation-261", {
    imagePaths: [
      "/money/100ar.png",
      "/money/2000ar.png",
      "/money/5000ar.png",
      "/money/1000ar.png",
      "/money/20000ar.png"
    ]
  });

  return (
    <div className="flex-1 bg-animation-261 overflow-y-auto p-4 space-y-4">
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
              <AvatarImage
                src={message.avatar || "/default-avatar.png"}
                alt="User Avatar"
              />
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
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
