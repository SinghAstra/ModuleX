"use client";

import { useRepoDetail } from "@/hooks/queries/use-repo-detail";
import { useRepoLogs } from "@/hooks/queries/use-repo-logs";
import { useRepoSocket } from "@/hooks/queries/use-repo-socket";
import { FullRepoMetadata } from "@/services/repo-service";
import { Log } from "@understand-x/database";
import { REPO_STATUS } from "@understand-x/shared";
import { CodeExplorer } from "./components/code-explorer";
import LogsView from "./components/logs-view";
import { RepoHeader } from "./components/repo-header";

interface RepoClientPageProps {
  repoId: string;
  initialData: FullRepoMetadata["repo"];
  audit: FullRepoMetadata["audit"];
  initialLogs: Log[];
}

export default function RepoClientPage({
  repoId,
  initialData,
  audit,
  initialLogs,
}: RepoClientPageProps) {
  useRepoSocket(repoId);
  const { data: repo } = useRepoDetail(repoId, initialData);
  const { data: logs = [] } = useRepoLogs(repoId, initialLogs);

  const isProcessing =
    repo?.status === REPO_STATUS.PROCESSING ||
    repo?.status === REPO_STATUS.QUEUED;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <RepoHeader repo={repo} audit={audit} />

      <main className="flex-1 overflow-hidden ">
        {repo.status !== REPO_STATUS.COMPLETED ? (
          <CodeExplorer repoId={repoId} />
        ) : (
          <LogsView logs={logs} isLoading={true} />
        )}
      </main>
    </div>
  );
}
