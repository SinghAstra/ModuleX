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
      transports: ["websocket"],
    });

    socket.on(SOCKET_EVENTS.LOG_UPDATED, (newLog: Log) => {
      queryClient.setQueryData(
        repoKeys.logs(repoId),
        (oldLogs: Log[] | undefined) => {
          const currentLogs = oldLogs || [];

          if (currentLogs.some((log) => log.id === newLog.id)) {
            return currentLogs;
          }

          return [newLog, ...currentLogs];
        }
      );

      queryClient.setQueryData(repoKeys.detail(repoId), (oldRepo: any) => {
        if (!oldRepo) return oldRepo;
        return { ...oldRepo, status: newLog.status };
      });

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
      socket.off(SOCKET_EVENTS.LOG_UPDATED);
      socket.disconnect();
    };
  }, [repoId, queryClient]);
};
