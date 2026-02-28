import { Editor } from "./components/editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import Title from "./components/title";

export default function Page() {
  return (
    <ScrollArea className="p-10 h-screen">
      <Title />
      <Editor />
    </ScrollArea>
  );
}
