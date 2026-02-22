// -------------------- SEARCH ---------------------
export default function SearchWorkspace() {
  return (
    <section className="w-[70%] mx-auto py-6">
      <div className="flex items-center gap-2 w-fit mx-auto ">
        <input
          className="outline-none border-b border-gray-600 text-lg px-4 bg-transparent placeholder-gray-400"
          type="text"
          placeholder="Search your workspaces"
        />
      </div>
    </section>
  );
}