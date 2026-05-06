import { Phone, Video, MoreVertical, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserStatusItem } from "@/components/user-status-item";
import { useNavigate } from "react-router";
import { useChattingPageContext } from "../_chatting-page.context";

export function ChatHeader() {
  const navigator = useNavigate();
  const { channel } = useChattingPageContext();

  return (
    <div className="flex items-center justify-between border-b bg-card p-4">
      {/* Left: User Profile Section */}
      <div className="flex items-center gap-2">
        <Button onClick={() => navigator(-1)}>
          <ArrowLeft />
        </Button>
        <UserStatusItem
          user={{
            _id: channel?._id || "",
            name: channel?.name || "Default",
            email: "Communication Channel",
            __v: 0,
            avatar: "",
            createdAt: "",
            updatedAt: "",
          }}
        />
      </div>

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
