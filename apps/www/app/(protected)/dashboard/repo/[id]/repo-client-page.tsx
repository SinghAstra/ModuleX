"use client";

import { useRepoSocket } from "@/hooks/use-repo-socket";
import type { FullRepoMetadata } from "@/services/repo-service";
import { useQuery } from "@tanstack/react-query";
import { REPO_STATUS } from "@understand-x/shared";
import { CodeExplorer } from "./components/code-explorer";
import { RepoHeader } from "./components/repo-header";
import { TerminalView } from "./components/terminal-view";

interface RepoClientPageProps {
  repoId: string;
  initialData: FullRepoMetadata["repo"];
  audit: FullRepoMetadata["audit"];
}

export default function RepoClientPage({
  repoId,
  initialData,
  audit,
}: RepoClientPageProps) {
  useRepoSocket(repoId);

  const { data: repo } = useQuery({
    queryKey: ["repo", repoId],
    initialData: initialData,
    select: (data) => data as FullRepoMetadata["repo"],
    queryFn: () => initialData,
    staleTime: Infinity,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <RepoHeader repo={repo} audit={audit} />

      <main className="flex-1 relative">
        {repo.status === REPO_STATUS.COMPLETED ? (
          <CodeExplorer repoId={repoId} />
          // <h1>Code Explorer</h1>
        ) : (
          <h1>Terminal View</h1>
          // <TerminalView logs={repo.logs} />
        )}
      </main>
    </div>
  );
}
