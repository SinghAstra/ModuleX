"use client";
import { useEffect, useRef, useState } from "react";

export function TerminalView({ logs }: { logs: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.map((log, i) => (
          <div
            key={log.id}
            className="group flex gap-3 hover:bg-muted/50 rounded px-1"
          >
            <span className="text-muted-foreground shrink-0 tabular-nums">
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour12: false,
              })}
            </span>
            <span
              className={`break-all ${
                log.level === "ERROR"
                  ? "text-rose-400"
                  : log.level === "WARN"
                  ? "text-amber-300"
                  : "text-slate-300"
              }`}
            >
              <span className="text-muted-foreground/50 mr-2">$</span>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
