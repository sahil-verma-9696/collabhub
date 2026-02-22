import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

// -------------------- WORKSPACE CARD ---------------------
export default function WorkspaceCard({ ws, handleDelete, handleEdit }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

  const handleCardClick = () => {
    navigate(`/workspaces/${ws.id}`);
  };

  return (
    <Button variant={"ghost"} onClick={handleCardClick}>
      <h2 className="text-xl font-medium block">{ws.name}</h2>
      <p className="text-sm text-gray-400">{ws.description}</p>
    </Button>
  );
}
