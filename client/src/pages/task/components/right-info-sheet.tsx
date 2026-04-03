import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { darkenColor } from "@/utils/darkenColor";
import { Settings, Trash } from "lucide-react";
import type { CSSProperties } from "react";
import { usePageContext } from "../_context";
import type { Response } from "@/services/get-tasks";

export function RightInfoSheet({ task }: { task: Response }) {
  const ctx = usePageContext();

  return (
    <Card className="w-[30%] block px-6 shadow-none border-none space-y-2">
      <div>
        <Button className="flex justify-between w-full bg-transparent border border-transparent text-gray-900 hover:bg-gray-300 hover:border-gray-900 hover:border">
          <span>Assignee</span>
          <Settings />
        </Button>
        <Card className="shadow-none border-none p-3">
          <span className="text-gray-700 text-sm">No assignee</span>
        </Card>
      </div>

      <Separator className="bg-gray-600" />

      {ctx.filters.map((f) => {
        const filterValue = task.filters.find((tf) => tf.filterId === f._id);

        const style: CSSProperties = {
          borderColor: darkenColor(filterValue?.color, 0.2),
          backgroundColor: `${filterValue?.color}10`,
          color: darkenColor(filterValue?.color, 0.8),
        };
        return (
          <>
            <div>
              <Button className="flex justify-between w-full bg-transparent  border border-transparent text-gray-900 hover:bg-gray-200 hover:border-gray-400 hover:border">
                <span>{f.name}</span>
                <Settings />
              </Button>
              <Card className="shadow-none border-none p-3 flex">
                {filterValue ? (
                  <Badge variant="outline" style={style}>
                    {filterValue?.valueName}
                  </Badge>
                ) : (
                  <span className="text-gray-700 text-sm">No {f.name}</span>
                )}
              </Card>
            </div>

            <Separator className="bg-gray-600" />
          </>
        );
      })}

      <div>
        <Button className="flex justify-start w-full bg-transparent border border-transparent text-red-500 hover:text-white hover:bg-red-600 hover:border-red-900 hover:border">
          <Trash />
          <span>Delete task</span>
        </Button>
      </div>
    </Card>
  );
}
