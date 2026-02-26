"use client";

import { Badge } from "@/components/ui/badge";
import { getRelativeTime } from "@/lib/utils/date";
import type { Log } from "@understand-x/database";
import { REPO_STATUS } from "@understand-x/shared";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  [REPO_STATUS.QUEUED]: { bg: "bg-muted/50", text: "text-muted-foreground" },
  [REPO_STATUS.PROCESSING]: { bg: "bg-primary/5", text: "text-primary" },
  [REPO_STATUS.COMPLETED]: { bg: "bg-green-500/10", text: "text-green-500" },
  [REPO_STATUS.FAILED]: { bg: "bg-destructive/10", text: "text-destructive" },
};

interface LogItemProps {
  log: Log;
}

export const LogItem = ({ log }: LogItemProps) => {
  const { bg, text } = STATUS_COLORS[log.status];

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2 rounded border border-transparent transition-colors hover:bg-muted/30 ${bg}`}
    >
      <Badge
        variant="secondary"
        className={`shrink-0 ${text} border-0 font-semibold uppercase text-xs tracking-wider mt-0.5 rounded bg-background`}
      >
        {log.status}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-foreground/90 wrap-break-word">{log.message}</p>
      </div>
      <span className="shrink-0 text-muted-foreground/60 text-xs whitespace-nowrap">
        {getRelativeTime(log.createdAt)}
      </span>
    </div>
  );
};

export default LogItem;
