import { getSidebarRepos, SidebarRepo } from "@/services/repo-service";
import { useQuery } from "@tanstack/react-query";
import { repoKeys } from "./query-keys";

export function useRepos(initialData: SidebarRepo[]) {
  return useQuery<SidebarRepo[]>({
    queryKey: repoKeys.lists(),
    queryFn: () => getSidebarRepos(),
    initialData,
  });
}
