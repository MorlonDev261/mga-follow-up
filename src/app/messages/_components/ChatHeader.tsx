import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

const ChatHeader = ({
  chat,
  onBack,
}: {
  chat?: { name: string; avatar: string };
  onBack?: () => void;
}) => {
  const isOnline = chat ? true : false; // Remplace ceci par un vrai état "online"

  return (
    <div className="border-b p-4 flex items-center gap-3">
      {/* Bouton Retour sur mobile */}
      {onBack && (
        <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <Avatar>
        <AvatarImage
          src={chat?.avatar || ""}
          alt={chat?.name || "User"}
        />
      </Avatar>

      <div>
        <h2 className="font-semibold">{chat?.name || "Sélectionnez une discussion"}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isOnline ? "En ligne" : "Commencez une conversation"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
