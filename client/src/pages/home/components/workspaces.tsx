import { useEffect, useState } from "react";
import { InboxIcon, Plus } from "lucide-react";
import WorkspaceCard from "./workspace-card";
import CreateWorkspaceForm from "./create-workspace";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Link } from "react-router";

export default function Workspaces() {
  const [showForm, setShowForm] = useState(false);

  // GET workspaces
  async function userWorkspaces() {
    const res = await fetch("http://localhost:8000/workspaces", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    console.log(resData.data);
    setWorkspaces(resData.data);
  }

  // POST workspace
  async function createWorkspaces(workspaceData) {
    const res = await fetch("http://localhost:8000/workspaces/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workspaceData),
    });

    const resData = await res.json();

    if (res.ok) {
      // userWorkspaces(); // refresh list
      setShowForm(false);
    } else {
      console.log(resData.message);
    }
  }
  async function DeleteWorkspaces(workspaceId) {
    const res = await fetch(`http://localhost:8000/workspaces/${workspaceId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const resData = await res.json();
    return { ok: res.ok, data: resData };
  }

  const handleDeleteWorkspace = (id) => async () => {};

  const handleEditWorkspace = (id) => () => {
    console.log(id);
    setShowForm(true);
  };

  useEffect(() => {
    userWorkspaces();
  }, []);

  return (
    <section className="w-[70%] mx-auto">
      <div className="min-h-screen px-6 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Workspaces</h2>
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1f1f1f] hover:bg-[#2b2b2b] border border-gray-700 text-sm"
          >
            <Plus size={16} /> New Workspace
          </Button>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Link to={"/me/workspaces/1"}>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <Button>
                  <InboxIcon />
                </Button>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Workspace 1</ItemTitle>
                <ItemDescription>
                  The standard size for most use cases.
                </ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        </div>
      </div>

      {showForm && (
        <CreateWorkspaceForm
          onClose={() => setShowForm(false)}
          onSubmit={createWorkspaces} // ✅ direct backend call
        />
      )}
    </section>
  );
}
