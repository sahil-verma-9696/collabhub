import React, { useState } from "react";
import { Plus, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Member } from "@/services/get-members";
import getMembers from "@/services/get-members";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import localSpace from "@/services/local-space";
import { postChannel, type Channel } from "@/services/post-channel";
import { usePageContext } from "../_context";

export default function CreateChannelDialog() {
  const { projectId } = useParams();
  const [channelName, setChannelName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { setChannels } = usePageContext();
  const [openDialog, setOpenDialog] = useState(false);



  const [members, setMembers] = useState<Member[]>();
  const [loading, setLoading] = useState(false);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateChannel = async () => {
    const payload = {
      name: channelName,
      members: selectedUsers.length > 0 ? selectedUsers : null,
    };

    console.log(payload);

    // api call here
    const response = await postChannel(projectId, payload);

    setChannels((prev) => [...prev, response as Channel]);

    setOpenDialog(false);
    setChannelName("");
    setSelectedUsers([]);
    
    toast.success("Channel created successfully");
  };

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const members = await getMembers(projectId);

        setMembers(members);
        setLoading(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to fetch");
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Channel Name */}
          <div className="space-y-2">
            <Label>Channel Name</Label>

            <Input
              placeholder="Enter channel name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>

          {/* Users List */}
          <div className="space-y-3">
            <Label>Select Members</Label>

            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {loading && <p>Loading...</p>}
              {members &&
                members.map((m) => {
                  const isSelected = selectedUsers.includes(m.user._id);
                  if (m.user._id === localSpace.getUser()?._id) return null;
                  return (
                    <div
                      key={m._id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/40 cursor-pointer"
                      onClick={() => toggleUser(m.user._id)}
                    >
                      <div>
                        <p className="font-medium text-sm">{m.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.user.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}

                        <Checkbox checked={isSelected} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateChannel} disabled={!channelName.trim()}>
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
