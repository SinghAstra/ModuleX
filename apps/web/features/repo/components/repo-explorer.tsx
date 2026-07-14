"use client";

import { useRepositoryFiles } from "@/features/repo/hooks/use-repo-files";
import { RepositoryLoadingSkeleton } from "./repo-loading-skeleton";
import { RepoTreeList } from "./tree/repo-tree-list";

interface RepositoryExplorerProps {
  repositoryId: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

export function RepositoryExplorer({
  repositoryId,
  expandedFolders,
  onToggleFolder,
}: RepositoryExplorerProps) {
  const { data: treeNodes = [], isLoading } = useRepositoryFiles(repositoryId);

  if (isLoading) {
    return (
      <div className="border bg-card/50 rounded flex flex-col shadow-sm h-full overflow-y-auto w-full backdrop-blur-sm">
        <div className="flex-1 p-2">
          <RepositoryLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (treeNodes.length === 0) {
    return (
      <div className="border bg-card/50 rounded flex items-center justify-center text-xs text-muted-foreground/40 font-sans italic select-none py-12 backdrop-blur-sm min-h-[50px]">
        Empty directory tree.
      </div>
    );
  }

  return (
    <div className="border bg-card/50 rounded flex flex-col shadow-sm h-full overflow-y-auto w-full backdrop-blur-sm">
      <div className="flex-1 p-2">
        <RepoTreeList
          nodes={treeNodes}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
        />
      </div>
    </div>
  );
}
