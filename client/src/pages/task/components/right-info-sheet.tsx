import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { darkenColor } from "@/utils/darkenColor";
import { Trash } from "lucide-react";
import { usePageContext } from "../_context";
import type { CSSProperties } from "react";
import type { Assignee, Response } from "@/services/get-tasks";
import { TaskProperty, type Value } from "./task-property";
import React, { useState } from "react";
import getMembers, { type Member } from "@/services/get-members";
import { toast } from "react-toastify";
import { postTaskAssignee } from "@/services/post-task-assignee";
import { deleteTaskAssignee } from "@/services/delete-task-assigneets";

export function RightInfoSheet({ task }: { task: Response }) {
  const ctx = usePageContext();

  return (
    <Card className="w-[30%] block px-6 shadow-none border-none space-y-2">
      <TaskAssignee task={task} />
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

function TaskAssignee({ task }: { task: Response }) {
  const { projectId, setTasks } = usePageContext();
  const [members, setMembers] = useState<Member[]>();
  const [loading, setLoading] = useState(false);

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

  async function handleSelectionChange(m: Value<Member>) {
    const newAssignment: Assignee = {
      __v: 0,
      _id: "",
      assignor: "",
      createdAt: "",
      deletedAt: null,
      deletor: null,
      isDeleted: false,
      project: projectId!,
      task: task._id,
      updatedAt: "",
      user: m.data.user._id,
    };
    if (m.checked) {
      // State Update
      setTasks((tasks) => {
        return tasks.map((t) => {
          if (t._id === task._id) {
            return {
              ...t,
              assignees: [...t.assignees, newAssignment],
            };
          }
          return t;
        });
      });

      // API Call
      await postTaskAssignee(projectId, task._id, { user: m.data.user._id });
    } else {
      // State Update
      setTasks((tasks) => {
        return tasks.map((t) => {
          if (t._id === task._id) {
            return {
              ...t,
              assignees: t.assignees.filter((a) => a.user !== m.data.user._id),
            };
          }
          return t;
        });
      });

      // API Call
      await deleteTaskAssignee(projectId, task._id, {
        user: m.data.user._id,
      });
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <TaskProperty
        name="Assignee"
        initValue={members?.map((m) => {
          return {
            _id: m._id,
            checked: task.assignees.some((a) => a.user === m.user._id),
            data: m,
          };
        })}
        onChange={handleSelectionChange}
        valueUi={({ data }) => {
          return (
            <>
              <div>
                <span className="text-gray-700 text-sm">{data.user.email}</span>
              </div>
            </>
          );
        }}
      >
        {members?.map((m) => {
          if (task.assignees.some((a) => a.user === m.user._id)) {
            return (
              <div key={m._id}>
                <span className="text-gray-700 text-sm">{m.user.email}</span>
              </div>
            );
          }
        })}
        {task.assignees.length === 0 && (
          <span className="text-gray-700 text-sm">No assignee</span>
        )}
      </TaskProperty>
    </>
  );
}
