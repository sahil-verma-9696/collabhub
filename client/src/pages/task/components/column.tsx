import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import React, { type CSSProperties } from "react";
import TaskForm from "./task-form";
import type { Response } from "@/services/get-tasks";
import { darkenColor } from "@/utils/darkenColor";
import { ItemInfoSheet } from "./item-info-sheet";

type ColumnProps = React.HTMLAttributes<HTMLDivElement> & {
  name?: string;
  color?: string;
  filterValueId?: string;
  items?: string | number;
};

export function Column({
  name = "Backlog",
  color,
  children,
  className,
  filterValueId,
  items = "0",
  ...props
}: ColumnProps) {
  const coloredStyle = {
    borderColor: darkenColor(color || "#000000", 0.6),
    backgroundColor: `${color}10`,
  };

  return (
    <Card
      data-slot="column"
      className={cn("w-80 shrink-0", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            {color && (
              <Badge
                variant="outline"
                className={cn("w-4 h-4 rounded-full")}
                style={coloredStyle}
              ></Badge>
            )}
            <span className="font-semibold text-xl">{name}</span>
            <Badge variant="outline">{items}</Badge>
          </div>

          <Button variant="outline">
            <MoreHorizontal />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-120">
          <div className="space-y-2">{children}</div>
        </ScrollArea>
        {filterValueId && (
          <TaskForm filterValueId={filterValueId}>
            <Button className="w-full">
              <Plus />
              <span>Add Item</span>
            </Button>
          </TaskForm>
        )}
      </CardContent>
    </Card>
  );
}

export type ConlumnItemProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  task?: Response;
};

export function ColumnItem({
  title,
  task,
  className,
  ...props
}: ConlumnItemProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  if (!task) return null;

  return (
    <Card
      data-slot="column-item"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task._id);
        // document.body.style.cursor = "grabbing";
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setIsDragging(false)} // ✅ FIX
      className={cn(
        "transition-all duration-200 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-95 shadow-lg",
        className,
      )}
      {...props}
    >
      <CardContent>
        <div className="space-x-2">
          <ItemInfoSheet task={task}>
            <Button
              variant={"link"}
              className="font-semibold p-0 cursor-pointer"
            >
              {title || "Untitled"}
            </Button>
          </ItemInfoSheet>
          <Badge variant="outline">
            <MoreHorizontal />
          </Badge>
        </div>
        <p className="text-xs pb-3">{task?.description}</p>
        <div className="flex gap-2 flex-wrap">
          {task?.filters.map((f) => {
            const style: CSSProperties = {
              borderColor: darkenColor(f.color, 0.2),
              backgroundColor: `${f.color}10`,
              color: darkenColor(f.color, 0.8),
            };
            return (
              <Badge key={f.valueId} style={style} variant="outline">
                {f.valueName}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
