import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserStatusItem } from "@/components/user-status-item";
import type { User } from "@/services/auth";

interface ChatHeaderProps {
  user?: User;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b bg-card p-4">
      {/* Left: User Profile Section */}
      <UserStatusItem user={user} />

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
