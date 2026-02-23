import { prisma } from "@understand-x/database";
import { AnalysisInput } from "./components/analysis-input";
import { RepoCard } from "./components/repo-card";

export default async function DashboardPage() {
  const repos = await prisma.repository.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { files: true } },
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* 1. Trigger Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Codebases</h1>
        <p className="text-muted-foreground text-lg">
          Connect a repository to map its implementation.
        </p>
        <div className="max-w-2xl mx-auto pt-4">
          <AnalysisInput />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Processed Repositories</h2>
          <span className="text-sm text-muted-foreground">
            {repos.length} Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}

          {repos.length === 0 && (
            <div className="col-span-full py-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
              <p>No repositories found. Start by pasting a URL above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
