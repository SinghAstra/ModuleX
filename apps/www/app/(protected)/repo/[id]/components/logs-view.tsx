"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Log } from "@understand-x/database";
import { REPO_STATUS } from "@understand-x/shared";
import { useEffect, useRef } from "react";

interface LogsViewProps {
  logs?: Log[];
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  [REPO_STATUS.QUEUED]: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
  },
  [REPO_STATUS.PROCESSING]: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  [REPO_STATUS.COMPLETED]: {
    bg: "bg-green-500/10",
    text: "text-green-500",
  },
  [REPO_STATUS.FAILED]: {
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function LogsView({ logs = [], isLoading = false }: LogsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const colors = (status: string) =>
    STATUS_COLORS[status] || STATUS_COLORS[REPO_STATUS.QUEUED];

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-2 font-mono text-sm">
          {logs.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground/50">
              <p>No logs yet</p>
            </div>
          ) : (
            <>
              {logs.map((log) => {
                const { bg, text } = colors(log.status);
                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 px-3 py-2 rounded border border-transparent transition-colors hover:bg-muted/30 ${bg}`}
                  >
                    <Badge
                      variant="secondary"
                      className={`flex-shrink-0 ${text} border-0 font-semibold uppercase text-xs tracking-wider mt-0.5`}
                    >
                      {log.status}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/90 break-words">
                        {log.message}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-muted-foreground/60 text-xs whitespace-nowrap">
                      {getRelativeTime(log.createdAt)}
                    </span>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground/70">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse animation-delay-100" />
                    <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse animation-delay-200" />
                  </div>
                  <span className="text-xs">Processing...</span>
                </div>
              )}
              <div ref={logsEndRef} />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
