import { env } from "@/env";
import { SidebarRepo } from "@/services/repo-service";
import { useQueryClient } from "@tanstack/react-query";
import type { Log } from "@understand-x/database";
import { SOCKET_EVENTS } from "@understand-x/shared";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { repoKeys } from "./query-keys";

export const useRepoSocket = (repoId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_API_URL, {
      query: { repoId },
    });

    socket.on(SOCKET_EVENTS.LOG_UPDATED, (newLog: Log) => {
      // 1. Update the Logs (Terminal View)
      queryClient.setQueryData(
        repoKeys.logs(repoId),
        (oldLogs: Log[] | undefined) => {
          return [newLog, ...(oldLogs || [])].slice(0, 50);
        }
      );

      // 2. Update the Specific Repo Status (Detail View)
      queryClient.setQueryData(repoKeys.detail(repoId), (oldRepo: any) => {
        if (!oldRepo) return oldRepo;
        return { ...oldRepo, status: newLog.status };
      });

      // 3. Update the Sidebar List
      queryClient.setQueryData(
        repoKeys.lists(),
        (oldRepos: SidebarRepo[] | undefined) => {
          if (!oldRepos) return oldRepos;
          return oldRepos.map((r) =>
            r.id === repoId ? { ...r, status: newLog.status } : r
          );
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [repoId, queryClient]);
};
