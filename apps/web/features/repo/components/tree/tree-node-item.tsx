"use client";

import { cn } from "@/lib/utils";
import { type RepositoryTreeNode } from "@repo/shared";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import React from "react";

interface TreeNodeItemProps {
  node: RepositoryTreeNode;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

export function TreeNodeItem({
  node,
  expandedFolders,
  onToggleFolder,
}: TreeNodeItemProps) {
  const isFolder = node.type === "folder";
  const isFolderOpen = expandedFolders.has(node.relativePath);

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (isFolder) {
      onToggleFolder(node.relativePath);
    }
  };

  return (
    <li className="list-none">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 group select-none relative",
          isFolder
            ? "cursor-pointer hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            : "text-muted-foreground"
        )}
      >
        <div className="size-4 flex items-center justify-center shrink-0">
          {isFolder &&
            (isFolderOpen ? (
              <ChevronDown className="size-3.5 text-muted-foreground/60" />
            ) : (
              <ChevronRight className="size-3.5 text-muted-foreground/60" />
            ))}
        </div>

        {isFolder ? (
          isFolderOpen ? (
            <FolderOpen className="size-4 text-primary/70 fill-primary/5 shrink-0" />
          ) : (
            <Folder className="size-4 text-primary/70 fill-primary/5 shrink-0" />
          )
        ) : (
          <FileText className="size-4 shrink-0 text-muted-foreground/40" />
        )}

        <span className="truncate font-medium text-foreground/80">
          {node.name}
        </span>

        {!isFolder && (
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            {node.summaryStatus === "PENDING" && (
              <span className="text-[10px] bg-muted text-muted-foreground/70 px-1.5 py-0.5 rounded border border-border/40 select-none">
                Waiting...
              </span>
            )}

            {node.summaryStatus === "PROCESSING" && (
              <span className="text-[10px] bg-muted text-muted-foreground/70 px-1.5 py-0.5 rounded border border-border/40 select-none">
                Analyzing...
              </span>
            )}

            {node.summaryStatus === "FAILED" && (
              <span className="text-[10px] bg-muted text-muted-foreground/70 px-1.5 py-0.5 rounded border border-border/40 select-none">
                Failed
              </span>
            )}
          </div>
        )}
      </div>

      {isFolder && isFolderOpen && node.moduleSummary && (
        <div className="pl-4 pr-3 py-3 my-2 ml-6 bg-primary/5 border border-primary/15 rounded-md text-xs text-foreground/90 font-sans shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1.5 mb-2 border-b border-primary/10 pb-1.5">
            <Cpu className="size-3.5 text-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Module Architecture
            </h4>
          </div>
          <div className="whitespace-pre-wrap leading-relaxed opacity-90">
            {node.moduleSummary}
          </div>
        </div>
      )}

      {isFolder && isFolderOpen && node.children.length > 0 && (
        <div className="pl-3.5 ml-2 border-l border-border/40 mt-0.5 space-y-0.5 animate-in fade-in duration-200">
          <ul className="space-y-0.5">
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.relativePath}
                node={child}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </ul>
        </div>
      )}

      {isFolder && isFolderOpen && node.children.length === 0 && (
        <div className="pl-8 py-1 text-[11px] text-muted-foreground/30 font-sans italic select-none">
          Empty directory
        </div>
      )}
    </li>
  );
}
