import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = ({ chat }: { chat?: { name: string; avatar: string } }) => {
  return (
    <div className="border-b p-4 flex items-center gap-3">
      <Avatar>
        <AvatarImage src={chat?.avatar} />
      </Avatar>
      <div>
        <h2 className="font-semibold">{chat?.name || "Select a chat"}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {chat ? "online" : "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
