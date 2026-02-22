import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const STATUS_COLORS = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
} as const;

export type UserStatusItemProps = {
  userAvatar?: string;
  userName?: string;
  userStatus?: keyof typeof STATUS_COLORS;
  lastSeen?: string;
};

export function UserChatItem({
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  userName = "John Doe",
  userStatus = "online",
  lastSeen = "5 min ago",
}: UserStatusItemProps) {
  return (
    <div
      data-slot="user-status-item"
      className="flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-200"
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              STATUS_COLORS[userStatus]
            }`} 
          />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{userName}</h2>
          <p className="text-xs text-muted-foreground">Hello there</p>
        </div>
      </div>

      <div className="text-xs text-white bg-black size-6 rounded-full flex justify-center items-center">
        14
      </div>
    </div>
  );
}
