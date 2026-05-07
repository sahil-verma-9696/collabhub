import {
  File,
  Link as LinkIcon,
  Copy,
  Reply,
  Forward,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ReplyPreview } from "./reply-preview";
import { formatTime } from "@/utils/formate-string";
import type { User } from "@/services/auth";
// import { usePageContext } from "../_context";

interface MessageBubbleProps {
  content?: string;
  timestamp: string;
  isOwn: boolean;
  type?: "text" | "image" | "pdf" | "link";
  mediaUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkUrl?: string;
  replyTo?: { content: string; senderName?: string };
  onReply?: (content: string) => void;
  onForward?: (content: string) => void;
  sender?: User;
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  type = "text",
  mediaUrl,
  linkTitle,
  linkDescription,
  linkUrl,
  replyTo,
  sender,
  onReply,
  onForward,
}: MessageBubbleProps) {
  const [showActions] = useState(true);
  // const { observeMessage } = usePageContext();

  const bubbleColor = isOwn
    ? "bg-blue-500 text-white"
    : "bg-secondary text-secondary-foreground";

  return (
    <div
      // ref={observeMessage}
      data-message-sender={sender}
      className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
      // onMouseEnter={() => setShowActions(true)}
      // onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex gap-1 max-w-xs ${isOwn ? "items-end" : "items-start"}`}
      >
        {/* Actions */}
        <div
          className={`flex items-center gap-2 text-xs text-muted-foreground`}
        >
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "end" : "start"}>
                <DropdownMenuItem onClick={() => onReply?.(content!)}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onForward?.(content!)}>
                  <Forward className="mr-2 h-4 w-4" />
                  Forward
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </DropdownMenuItem>
                {isOwn && (
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${bubbleColor}`}>
          {/* Reply Context */}
          {replyTo && (
            <ReplyPreview
              content={replyTo.content}
              senderName={replyTo.senderName}
              isOwn={isOwn}
              inMessage={true}
            />
          )}

          {type === "text" && <p className="text-sm">{content}</p>}

          {type === "image" && (
            <div className="flex flex-col gap-2">
              {mediaUrl && (
                <img
                  src={mediaUrl}
                  alt="shared image"
                  className=" rounded-md object-fit-contain"
                />
              )}
              {content && <p className="text-sm">{content}</p>}
            </div>
          )}

          {type === "pdf" && (
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{content}</span>
                <span className="text-xs opacity-75">PDF Document</span>
              </div>
            </div>
          )}

          {type === "link" && (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col gap-1 border border-current border-opacity-20 rounded-md p-2">
                {linkTitle && (
                  <p className="text-sm font-medium line-clamp-2">
                    {linkTitle}
                  </p>
                )}
                {linkDescription && (
                  <p className="text-xs opacity-75 line-clamp-2">
                    {linkDescription}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs">
                  <LinkIcon className="h-3 w-3" />
                  {linkUrl && (
                    <span className="truncate opacity-75">
                      {new URL(linkUrl).hostname}
                    </span>
                  )}
                </div>
              </div>
            </a>
          )}
          <div>
            <p className="flex items-center gap-2">
              <span className="text-xs italic">{formatTime(timestamp)}</span>
            </p>
            <p className="flex gap-2 italic">
              <span className="text-xs">
                By {sender?.name}( {sender?.email.split('@')[0]} )
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
