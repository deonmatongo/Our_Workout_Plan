import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/fitness';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

export const UserSwitcher = () => {
  const { currentUser, setCurrentUser, users, getUser } = useUser();

  const toggleUser = () => {
    setCurrentUser(currentUser === 'partner1' ? 'partner2' : 'partner1');
  };

  const user = getUser(currentUser);
  const otherUser = getUser(currentUser === 'partner1' ? 'partner2' : 'partner1');

  return (
    <button
      onClick={toggleUser}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 touch-manipulation"
      title={`Switch to ${otherUser.name}`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0)}
        </div>
        <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
      </div>
      <Users className="h-4 w-4 text-muted-foreground" />
    </button>
  );
};
