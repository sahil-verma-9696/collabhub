import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { darkenColor } from "@/utils/darkenColor";
import { Trash } from "lucide-react";
import { usePageContext } from "../_context";
import type { CSSProperties } from "react";
import type { Response } from "@/services/get-tasks";
import { TaskProperty } from "./task-property";

export function RightInfoSheet({ task }: { task: Response }) {
  const ctx = usePageContext();

  return (
    <Card className="w-[30%] block px-6 shadow-none border-none space-y-2">
      <TaskProperty
        name="Assignee"
        initValue={[
          {
            _id: "abc",
            checked: true,
            data: {
              _id: "abc",
              name: "John Doe",
            },
          },
          {
            _id: "def",
            checked: false,
            data: {
              _id: "def",
              name: "Jane Doe",
            },
          },
        ]}
        onChange={(d) => {
          console.log(d);
        }}
        valueUi={({ data }) => {
          return (
            <>
              <div>
                <span className="text-gray-700 text-sm">{data.name}</span>
              </div>
            </>
          );
        }}
      >
        <span className="text-gray-700 text-sm">No assignee</span>
      </TaskProperty>

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
            <TaskProperty name={f.name}>
              {filterValue ? (
                <Badge variant="outline" style={style}>
                  {filterValue?.valueName}
                </Badge>
              ) : (
                <span className="text-gray-700 text-sm">No {f.name}</span>
              )}
            </TaskProperty>
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
