import { useState } from "react";

// -------------------- CREATE WORKSPACE FORM ---------------------
export default function CreateWorkspaceForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const newWorkspace = {};

    onSubmit(newWorkspace);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] text-white p-6 rounded-lg w-full max-w-md border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Workspace</h2>

        <label className="block mb-2 text-sm">
          Name
          <input
            type="text"
            name="name"
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 outline-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block mb-4 text-sm">
          Description
          <textarea
            name="description"
            rows="3"
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 outline-none resize-none"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-600 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-green-600 rounded-md hover:bg-green-500"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
