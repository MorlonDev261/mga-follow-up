import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

interface ChatAvatarProps {
  src?: string;
  fallback?: ReactNode;
  isOnline?: boolean;
  isStory?: boolean;
  className?: string;
  children?: ReactNode;

}

const ProfileAvatar = ({ src, Fallback= <FaUser />, isOnline = false, isStory = false, className, children }: ChatAvatarProps) => {
  return (
    <span className={cn("relative", className)}>
      <Avatar className={cn(isStory && "border-2 border-green-700")}>
        <AvatarImage className="p-1" src={src} alt="Profile" />
        <AvatarFallback>{Fallback}</AvatarFallback>
      </Avatar>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
      {children}
    </span>
  );
};

// Export multiple pour un import propre
export default ProfileAvatar;
