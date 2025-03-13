import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatAvatarProps {
  src?: string;
  isStatus?: boolean;
  isStory?: boolean;
  className?: string;
  children: ReactNode;
}

const ProfileAvatar({ src, isStatus= false, isStory= false, className, children }: ChatAvatarProps) {
  return (
    <Avatar className={cn("relative", isStory && "border-2 border-orange-500", className)}>
      {children}
      {isStatus && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </Avatar>
  );
}

export { ProfileAvatar, AvatarImage, AvatarFallback };
