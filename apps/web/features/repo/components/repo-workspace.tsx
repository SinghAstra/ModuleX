"use client";

import { RepositoryExplorer } from "@/features/repo/components/repo-explorer";
import { RepoHeader } from "@/features/repo/components/repo-header";
import { useRepositoryFiles } from "@/features/repo/hooks/use-repo-files";
import {
  compileProjectSummaryText,
  extractAllFolderPaths,
} from "@/features/repo/utils/tree-utils";
import { logError } from "@repo/shared";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface RepositoryWorkspaceProps {
  repo: {
    id: string;
  };
}

export function RepositoryWorkspace({ repo }: RepositoryWorkspaceProps) {
  const { data: treeNodes = [] } = useRepositoryFiles(repo.id);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const allFolderPaths = extractAllFolderPaths(treeNodes);

  const isExpandedAll =
    allFolderPaths.length > 0 && expandedFolders.size === allFolderPaths.length;

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const handleToggleExpandAll = (): void => {
    if (isExpandedAll) {
      setExpandedFolders(new Set());
    } else {
      setExpandedFolders(new Set(allFolderPaths));
    }
  };

  const handleCopySummaryAll = async () => {
    if (treeNodes.length === 0) return;

    const compiledText = compileProjectSummaryText(treeNodes);
    if (!compiledText) {
      toast.error("Architecture map is not ready yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(compiledText);
      toast.success("Copied full architecture map to clipboard!");
    } catch (error) {
      logError(error);
      toast.error("Failed to copy map to clipboard.");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
      <RepoHeader
        isExpandedAll={isExpandedAll}
        onToggleExpandAll={handleToggleExpandAll}
        onCopySummaryAll={handleCopySummaryAll}
      />

      <main className="flex-1 overflow-y-auto h-full p-1 md:p-2 lg:p-4 animate-in fade-in duration-300">
        <RepositoryExplorer
          repositoryId={repo.id}
          expandedFolders={expandedFolders}
          onToggleFolder={handleToggleFolder}
        />
      </main>
    </div>
  );
}
