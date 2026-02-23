import React, { useEffect, useState } from "react";

const FileTreeSkeleton = () => {
  const skeltonItems = [
    { type: "folder", children: 3 },
    { type: "folder", children: 2 },
    { type: "file" },
    { type: "folder", children: 4 },
    { type: "file" },
    { type: "file" },
    { type: "folder", children: 1 },
    { type: "file" },
  ];

  return (
    <div className="flex flex-col gap-1 p-4">
      {skeltonItems.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-4 h-4 shrink-0">
              {item.type === "folder" && (
                <div className="w-3 h-3 bg-muted-foreground/20 rounded-sm animate-pulse" />
              )}
            </div>
            <div
              className="w-4 h-4 shrink-0 rounded animate-pulse"
              style={{
                backgroundColor:
                  item.type === "folder"
                    ? "rgb(251 191 36 / 0.12)"
                    : "rgb(96 165 250 / 0.12)",
              }}
            />
            <div
              className="flex-1 h-3 rounded-sm animate-pulse bg-muted-foreground/15"
              style={{ maxWidth: `${70 + (i % 4) * 15}px` }}
            />
          </div>

          {item.type === "folder" && item.children && (
            <div className="ml-3 space-y-1 pl-1 border-l border-muted-foreground/10">
              {Array.from({ length: item.children }).map((_, j) => (
                <div
                  key={j}
                  style={{ animationDelay: `${i * 30 + j * 20}ms` }}
                  className="flex items-center gap-2 px-2 py-1"
                >
                  <div className="w-4 h-4 shrink-0" />
                  <div className="w-4 h-4 shrink-0 rounded bg-blue-400/12 animate-pulse" />
                  <div
                    className="flex-1 h-3 rounded-sm animate-pulse bg-muted-foreground/10"
                    style={{ maxWidth: `${60 + ((i + j) % 3) * 20}px` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileTreeSkeleton;
