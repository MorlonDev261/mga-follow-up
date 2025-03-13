import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatAvatarProps {
  isOnline?: boolean;
  isStory?: boolean;
  className?: string;
  children?: ReactNode;
}

const ProfileAvatar = ({ isOnline = false, isStory = false, className, children }: ChatAvatarProps) => {
  return (
   <Avatar className={cn("overflow-visible", isStory && "border-2 p-1 border-orange-500", className)}>
     {children}
     {isOnline && (
       <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
     )}
   </Avatar>
  );
};

// Export multiple pour un import propre
export { ProfileAvatar, AvatarImage, AvatarFallback };
