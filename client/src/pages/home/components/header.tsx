import { APP_NAME } from "@/app.constatns";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";
import { Link } from "react-router";

// -------------------- HEADER ---------------------
export default function Header() {
  return (
    <header className="px-[15vw] py-2">
      <Link to={"/"} className="text-2xl font-semibold">
        <Button >
          <Command className="size-4" />
          {APP_NAME}
        </Button>
      </Link>
    </header>
  );
}
