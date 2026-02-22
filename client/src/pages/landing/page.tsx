import { Link } from "react-router";
import style from "./style";
import { useAuthContext } from "@/contexts/auth.contex";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/app.constatns";

export default function Page() {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className={style.page}>
      <div>
        {isAuthenticated ? (
          <Link to="/me/home">
            <Button className="cursor-pointer">Open {APP_NAME}</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
