import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import { Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Response } from "@/services/get-tasks";
import { usePageContext } from "../_context";
import { Input } from "@/components/ui/input";
import patchTask from "@/services/patch-task";
import { useTaskInfoSheet } from "../useTaskInfoSheet";
import { LeftInfoSheet } from "./left-info-sheet";
import { RightInfoSheet } from "./right-info-sheet";

export type ItemInfoSheetProps = React.HTMLAttributes<HTMLDivElement> & {
  task?: Response;
};

export function ItemInfoSheet({ children, task }: ItemInfoSheetProps) {
  const [open, setOpen] = React.useState(false);

  useTaskInfoSheet();

  if (!task) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[80%]">
          <ScrollArea className="h-screen">
            <div>
              <SheetHeader className="p-6">
                <>
                  <SheetTitle className="flex gap-1 items-center pr-6">
                    <TaskTitle taskId={task._id} taskTitle={task.title} />
                  </SheetTitle>
                </>
              </SheetHeader>

              <Separator />

              <div className="flex">
                <LeftInfoSheet task={task} />
                <RightInfoSheet task={task} />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

type TaskTitleProps = {
  taskId: string;
  taskTitle: string;
};

function TaskTitle({ taskId, taskTitle }: TaskTitleProps) {
  const [isEdit, setIsEdit] = React.useState(false);
  const ctx = usePageContext();

  if (!taskId || !taskTitle) return null;

  async function handleSaveClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
        title: string;
      };

      await patchTask(ctx.projectId as string, taskId, formData);

      ctx.setTasks((p) => {
        return p.map((t) => {
          if (t._id === taskId) {
            return {
              ...t,
              title: formData.title,
            };
          }
          return t;
        });
      });

      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  }

  function handleAllowEdit() {
    setIsEdit(true);
  }

  if (isEdit)
    return (
      <>
        <form
          onSubmit={handleSaveClick}
          className="flex gap-1 items-center w-full"
        >
          <Input name="title" defaultValue={taskTitle} />
          <Button
            variant={"outline"}
            type="submit"
            className="text-white bg-green-500 border border-green-800 hover:bg-green-600 hover:text-white"
          >
            Save
          </Button>
        </form>
      </>
    );
  else
    return (
      <>
        <span>{taskTitle}</span>
        <Button variant={"ghost"} type="button" onClick={handleAllowEdit}>
          <Pencil />
        </Button>
      </>
    );
}
