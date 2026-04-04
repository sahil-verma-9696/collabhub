import React from "react";
import patchTask from "@/services/patch-task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { usePageContext } from "../_context";
import type { Task } from "@/services/post-task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LeftInfoSheet({ task }: { task: Task }) {
  const [isEditDescription, setIsEditDescription] = React.useState(false);

  function handleAllowEdit() {
    setIsEditDescription(true);
  }

  return (
    <Card className="w-[70%] p-6 shadow-none border-none">
      <Card className="p-2   block">
        <CardHeader className="block p-2!">
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Sahil Verma{" "}
            <span className="text-gray-500">
              created on {new Date(task.createdAt || "").toLocaleDateString()}
            </span>
            <Button variant={"ghost"} onClick={handleAllowEdit}>
              <Pencil />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-1">
          <TaskDescription
            taskId={task._id}
            description={task.description}
            isEdit={isEditDescription}
            setIsEdit={setIsEditDescription}
          />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{"CN"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{"Sahil Verma"}</span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-800 mt-1">This is good man</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{"CN"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{"Sahil Verma"}</span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-800 mt-1">This is good man</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Add a Comment</Label>
        <Textarea placeholder="Write comment here..." />
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            type="submit"
            className="text-white bg-green-500 border border-green-800 hover:bg-green-600 hover:text-white"
          >
            Comment
          </Button>
        </div>
      </div>
    </Card>
  );
}

type TaskDescriptionProps = {
  description?: string;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
};

function TaskDescription({
  taskId,
  description,
  isEdit,
  setIsEdit,
}: TaskDescriptionProps) {
  const ctx = usePageContext();

  async function handleSaveClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEdit(false);

    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
        description: string;
      };

      await patchTask(ctx.projectId as string, taskId, formData);

      ctx.setTasks((p) => {
        return p.map((t) => {
          if (t._id === taskId) {
            return {
              ...t,
              description: formData.description,
            };
          }
          return t;
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleCancelEdit() {
    setIsEdit(false);
  }

  if (!isEdit)
    return (
      <>
        <p className="p-4 text-gray-800 text-sm">
          {description || "No description provided."}
        </p>
      </>
    );
  else
    return (
      <>
        <form onSubmit={handleSaveClick} className="space-y-2">
          <Textarea defaultValue={description} name="description" />

          <div className="flex justify-end gap-1">
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button
              variant={"outline"}
              type="submit"
              className="text-white bg-green-500 border border-green-800 hover:bg-green-600 hover:text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </>
    );
}
