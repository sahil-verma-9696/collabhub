import Header from "./components/header";
import SearchWorkspace from "./components/search";
import WelcomMessage from "./components/welcome-message";
import Workspaces from "./components/workspaces";

export default function Page() {
  return (
    <div className="size-full">
      <Header />
      <WelcomMessage />
      <SearchWorkspace />
      <Workspaces />
    </div>
  );
}
