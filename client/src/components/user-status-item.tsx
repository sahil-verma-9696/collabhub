import type { User } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const STATUS_COLORS = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
} as const;

export type UserStatusItemProps = {
  user?: User;
  userStatus?: keyof typeof STATUS_COLORS;
  lastSeen?: string;
};

export function UserStatusItem({
  userStatus = "online",
  lastSeen = "5 min ago",
  user,
}: UserStatusItemProps) {
  const {
    avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    name = "John Doe",
  } = (user as User) || {};
  return (
    <div data-slot="user-status-item" className="flex items-center gap-3">
      <div className="relative">
        <Avatar size="lg">
          <AvatarImage src={avatar!} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
            STATUS_COLORS[userStatus]
          }`}
        />
      </div>
      <div>
        <h2 className="font-semibold text-foreground">{name}</h2>
        <p className="text-xs text-muted-foreground">
          {userStatus === "online"
            ? "Online"
            : userStatus === "away"
              ? "Away"
              : `Last seen ${lastSeen}`}
        </p>
      </div>
    </div>
  );
}
