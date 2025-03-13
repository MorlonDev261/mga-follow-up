import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatAvatarProps {
  isOnline?: boolean;
  isStory?: boolean;
  className?: string;
  children?: ReactNode;
  badge?: ReactNode;

}

const ProfileAvatar = ({ isOnline = false, isStory = false, className, children, badge }: ChatAvatarProps) => {
  return (
    <span className={cn("relative", className)}>
      <Avatar className={cn(isStory && "border-2 border-green-700")}>
        {children}
      </Avatar>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </span>
  );
};

// Export multiple pour un import propre
export { ProfileAvatar, AvatarImage, AvatarFallback };
