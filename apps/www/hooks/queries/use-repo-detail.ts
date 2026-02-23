import { FullRepoMetadata } from "@/services/repo-service";
import { useQuery } from "@tanstack/react-query";
import { repoKeys } from "./query-keys";

export function useRepoDetail(
  repoId: string,
  initialData: FullRepoMetadata["repo"]
) {
  return useQuery({
    queryKey: repoKeys.detail(repoId),
    initialData,
    queryFn: async () => initialData,
  });
}
