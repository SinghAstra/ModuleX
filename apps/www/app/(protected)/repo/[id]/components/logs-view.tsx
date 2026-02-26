"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRelativeTime } from "@/lib/utils/date";
import type { Log } from "@understand-x/database";
import { REPO_STATUS } from "@understand-x/shared";
import { useEffect, useRef } from "react";
import LoadingDots from "./loading-dots";
import LogItem from "./log-item";

interface LogsViewProps {
  logs?: Log[];
  isLoading?: boolean;
}

function LogsView({ logs = [], isLoading = false }: LogsViewProps) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-background  h-full">
      <div className="p-4 space-y-2 font-mono text-sm">
        {logs.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground/50">
            <p>No logs yet</p>
          </div>
        ) : (
          <>
            {logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
            {isLoading && <LoadingDots />}
          </>
        )}
      </div>
    </div>
  );
}

export default LogsView;
