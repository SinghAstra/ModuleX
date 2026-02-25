import { getRepoLogs } from "@/services/log-service";
import { useQuery } from "@tanstack/react-query";
import type { Log } from "@understand-x/database";
import { repoKeys } from "./query-keys";

export const useRepoLogs = (repoId: string, initialLogs?: Log[]) => {
  return useQuery({
    queryKey: repoKeys.logs(repoId),
    queryFn: () => getRepoLogs(repoId),
    initialData: initialLogs,
  });
};
