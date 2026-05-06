import type { User } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import { Dialog, DialogContent } from "./ui/dialog";
import { UserProfile } from "./user-profile";
import React from "react";
import { cn } from "@/lib/utils";

export function UserListItem({
  user,
  lslot,
  nameBadge,
  isOpenDialogByAvtar = true,
  isOpenDialogByName,
  onAvtarClick,
  onNameClick,
  onClick,
  uid,
  className,
}: {
  user: Partial<User> | null;
  lslot?: React.ReactNode;
  nameBadge?: React.ReactNode;
  onAvtarClick?: (e: React.MouseEvent) => void;
  onNameClick?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  isOpenDialogByName?: boolean;
  isOpenDialogByAvtar?: boolean;
  uid?: string;
  className?: string;
}) {
  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false);
  if (!user) return null;

  function handleAvtarClick(e: React.MouseEvent) {
    if (onAvtarClick || isOpenDialogByAvtar) {
      e.stopPropagation();
    }
    if (isOpenDialogByAvtar) setIsOpenDialog(true);
    onAvtarClick?.(e);
  }
  function handleNameClick(e: React.MouseEvent) {
    if (onNameClick || isOpenDialogByName) {
      e.stopPropagation();
    }
    if (isOpenDialogByName) setIsOpenDialog(true);
    onNameClick?.(e);
  }
  function handleClick(e: React.MouseEvent) {
    if (onClick) e.stopPropagation();
    onClick?.(e);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setIsOpenDialog(false);
    }
  }
  return (
    <Card
      onClick={handleClick}
      data-slot="user-list-item"
      className={cn(
        "w-full rounded-md p-2 text-left hover:bg-accent focus:bg-accent focus:outline-none flex flex-row items-center justify-between shadow-none border-none",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar
          onClick={handleAvtarClick}
          className="rounded-full size-12 overflow-hidden bg-gray-200 flex justify-center items-center"
        >
          <AvatarImage src={user.avatar || ""} alt={user.name} />
          <AvatarFallback>{getNameAsAvtar(user.name)}</AvatarFallback>
        </Avatar>
        <div className="w-fit">
          <span
            onClick={handleNameClick}
            className="font-medium cursor-pointer"
          >
            {user.name || "User"} {nameBadge}
          </span>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {lslot}

      <Dialog open={isOpenDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent showCloseButton>
          <UserProfile userId={user._id || uid!} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
