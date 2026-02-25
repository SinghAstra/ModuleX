import { getRepoLogs } from "@/services/log-service";
import { getRepoWithMetadata } from "@/services/repo-service";
import { notFound } from "next/navigation";
import RepoClientPage from "./repo-client-page";

interface RepoPageProps {
  params: Promise<{ id: string }>;
}

async function RepoPage({ params }: RepoPageProps) {
  const { id } = await params;

  const [data, initialLogs] = await Promise.all([
    getRepoWithMetadata(id),
    getRepoLogs(id),
  ]);

  if (!data) notFound();

  return (
    <RepoClientPage
      repoId={id}
      initialData={data.repo}
      audit={data.audit}
      initialLogs={initialLogs}
    />
  );
}

export default RepoPage;
