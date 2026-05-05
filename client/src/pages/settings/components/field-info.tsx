import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";

import type { Filter } from "@/services/post-filter";
// import updateFilter from "@/services/update-filter";
import deleteFilter from "@/services/delete-filter";

import FilterOptions from "./option";

type Props = {
  selectedFilter: Filter | null;
  onDeleteSuccess: (id: string) => void;
  // onUpdateSuccess: (filter: Filter) => void;
};

export default function FieldInfo({
  selectedFilter,
  onDeleteSuccess,
  // onUpdateSuccess,
}: Props) {

  const { projectId } = useParams();

  const [name, setName] = useState("");
  // const [ setDescription] = useState("");

  /* populate form when filter changes */
  // useEffect(() => {
  //   if (selectedFilter) {
  //     setName(selectedFilter.name);
  //     setDescription(selectedFilter.description || "");
  //   }
  // }, [selectedFilter]);

  // async function handleUpdate() {
  //   if (!projectId || !selectedFilter) return;

  //   try {
  //     const updated = await updateFilter(
  //       projectId as string,
  //       selectedFilter._id,
  //       {
  //         name,
  //         description,
  //       }
  //     );

  //     onUpdateSuccess(updated);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function handleDelete() {
    if (!projectId || !selectedFilter) return;

    try {
      await deleteFilter(projectId as string, selectedFilter._id);

      onDeleteSuccess(selectedFilter._id);

    } catch (error) {
      console.error(error);
    }
  }

  if (!selectedFilter) {
    return <div>Select a filter</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {selectedFilter.name} field settings
        </h2>

        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          Delete field
        </Button>

      </div>

      {/* Filter name */}
      <div className="space-y-2">

        <Label>Filter name</Label>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
        />

      </div>

      {/* Filter type */}
      <div className="space-y-2">

        <Label>Field type</Label>

        <div className="inline-flex items-center border rounded-md px-3 py-2 text-sm bg-muted">
          Single select
        </div>

      </div>

      <FilterOptions selectedFilter={selectedFilter} />

    </div>
  );
}