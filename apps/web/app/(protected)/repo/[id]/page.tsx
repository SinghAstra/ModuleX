import { RepoWorkspaceShell } from "@/features/repo/components/repo-workspace-shell";
import { repoQueryFn } from "@/features/repo/hooks/use-repo";
import { repoKeys } from "@/features/repo/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { type Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Repository Workspace",
  description:
    "Explore your project structure and watch ReadmeX generate your perfect README in real-time.",
};

interface RepositoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: repoKeys.detail(id),
    queryFn: () => repoQueryFn(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RepoWorkspaceShell repositoryId={id} />
    </HydrationBoundary>
  );
}
