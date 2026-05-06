import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Channel } from "@/services/post-channel";
import { deleteChannel } from "@/services/delete-channel";
import { usePageContext } from "../_context";
import { toast } from "react-toastify";

export default function ChannelList({
  channels,
  channelsLoading,
}: {
  channels: Channel[];
  channelsLoading: boolean;
}) {
  const [deleteChannelId, setDeleteChannelId] = useState<string | null>(null);
  const { projectId } = useParams();
  const { setChannels } = usePageContext();

  const handleDeleteChannel = async () => {
    if (!deleteChannelId) return;

    try {
      console.log("Delete Channel:", deleteChannelId);

      // api call here
      await deleteChannel(projectId, deleteChannelId);

      toast.success("Channel deleted successfully");
      setChannels((prev) => prev.filter((c) => c._id !== deleteChannelId));
      setDeleteChannelId(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {channels && channels.length > 0 ? (
          channels.map((channel) => {
            return (
              <Link key={channel._id} to={channel._id}>
                <div className="group flex items-center justify-between rounded-xl border bg-background p-4 transition-all duration-200 hover:bg-muted/40 hover:shadow-sm cursor-pointer">
                  {/* Left Section */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase">
                      {channel.name?.charAt(0)}
                    </div>

                    {/* Channel Info */}
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {channel.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Channel conversation
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setDeleteChannelId(channel._id);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })
        ) : channelsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border animate-pulse bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-xl">
              #
            </div>

            <h3 className="font-medium">No channels found</h3>

            <p className="text-sm text-muted-foreground mt-1">
              Create a new channel to start chatting.
            </p>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteChannelId}
        onOpenChange={() => setDeleteChannelId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Channel</DialogTitle>

            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              channel and all its messages.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteChannelId(null)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDeleteChannel}>
              Delete Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
