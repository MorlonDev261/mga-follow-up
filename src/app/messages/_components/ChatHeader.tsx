import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";


const ChatHeader = ({
  chat,
  onBack,
}: {
  chat?: { name: string; avatar: string };
  onBack?: () => void;
}) => {
  const isOnline = chat ? true : false; // Remplace ceci par un vrai état "online"

  return (
    <div className="border-b p-2 flex items-center justify-between">
      {/* Bouton Retour sur mobile */}
      <div className="flex items-center gap-1">
        {onBack && (
          <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MdOutlineArrowBackIosNew size={18} />
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
      <div className="flex items-center justify-around w-[80px] gap-2">
        <span className="text-gray-500 hover:text-gray-600 cursor-pointer">
          <FaPhoneAlt size={20} />
        </span>
        <span className="text-gray-500 hover:text-gray-600 cursor-pointer">
          <FaVideo size={20} />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
