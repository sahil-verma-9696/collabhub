import { usePageContext } from "../_context";

export default function Title() {
  const ctx = usePageContext();
  return (
    <input
      placeholder="New Page"
      value={ctx.pageTitle}
      className="
          w-full
          border-0
          bg-transparent
          outline-none
          text-6xl
          font-bold
          mb-6
        "
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          ctx.editorRef.current?.focus(); // 👈 move cursor to editor
        }
      }}
      onChange={ctx.handleInputChange}
    />
  );
}
