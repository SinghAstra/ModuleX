"use client";

import { useRepoDetail } from "@/hooks/queries/use-repo-detail";
import { useRepoSocket } from "@/hooks/queries/use-repo-socket";
import { FullRepoMetadata } from "@/services/repo-service";
import { REPO_STATUS } from "@understand-x/shared";
import { CodeExplorer } from "./components/code-explorer";
import { RepoHeader } from "./components/repo-header";

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
  const { data: repo } = useRepoDetail(repoId, initialData);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <RepoHeader repo={repo} audit={audit} />

      <main className="flex-1 overflow-hidden ">
        {repo.status === REPO_STATUS.COMPLETED ? (
          <CodeExplorer repoId={repoId} />
        ) : (
          // <h1>Code Explorer</h1>
          <h1>Terminal View</h1>
          // <TerminalView logs={repo.logs} />
        )}
      </main>
    </div>
  );
}
