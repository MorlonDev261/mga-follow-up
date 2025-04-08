import { auth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  const { name, image } = session.user;
  const firstName = name?.split(' ')[0] || 'User';
  const fallback = name?.[0]?.toUpperCase() || 'MGA';

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7 border border-gray-300 dark:border-white">
        {image ? (
          <AvatarImage src={image} />
        ) : (
          <AvatarFallback>{fallback}</AvatarFallback>
        )}
      </Avatar>
      <span className="hidden md:block text-gray-800 dark:text-white">
        Hi, {firstName}
      </span>
    </div>
  );
}
