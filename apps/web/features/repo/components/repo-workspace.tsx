"use client";

import { RepoHeader } from "@/features/repo/components/repo-header";
import { MarkdownRenderer } from "./markdown-renderer";

interface RepositoryWorkspaceProps {
  repo: {
    id: string;
    readme: string | null;
  };
}

export function RepositoryWorkspace({ repo }: RepositoryWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
      <RepoHeader textToCopy={repo.readme} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {repo.readme ? (
          <div className="max-w-3xl mx-auto">
            <MarkdownRenderer content={repo.readme} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground py-20 text-center">
            <p>No README content was generated for this repository.</p>
          </div>
        )}
      </main>
    </div>
  );
}
