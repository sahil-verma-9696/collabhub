import localSpace from "@/services/local-space";
import { useParams } from "react-router";

export default function useMain() {
  const { projectId } = useParams();

  const user = localSpace.getUser();

  return {
    projectId,
    user,
  };
}
