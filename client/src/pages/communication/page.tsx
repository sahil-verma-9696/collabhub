import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seprateBySpaces, strCaptalize } from "@/utils/formate-string";
import { Tabs } from "@radix-ui/react-tabs";
import { Link } from "react-router";
import { usePageContext } from "./_context";
import CreateChannelDialog from "./components/create-channel-dialog";
import ChannelList from "./components/channel-list";

export default function ChatPanel() {
  const { channels, channelsLoading } = usePageContext();
  return (
    <div
      data-slot="chat-panel"
      className="flex h-[calc(100vh-16px)] flex-col bg-background space-y-2"
    >
      <div className="flex gap-2">
        <Input placeholder="Search channel" />
        <Button>Search</Button>
      </div>
      <div className="flex justify-between">
        <Tabs defaultValue={"Recent"} className="w-full">
          <TabsList>
            {["recent", "channels", "direct-chats"].map((r) => {
              return (
                <Link key={r} to={`?tab=${r}`}>
                  <TabsTrigger value={r}>
                    {strCaptalize(seprateBySpaces(r))}
                  </TabsTrigger>
                </Link>
              );
            })}
          </TabsList>
        </Tabs>

        <CreateChannelDialog />
      </div>

      <ChannelList channels={channels} channelsLoading={channelsLoading} />
    </div>
  );
}
