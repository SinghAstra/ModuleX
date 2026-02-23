import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FullRepoMetadata } from "@/services/repo-service";

interface RepoHeaderProps {
  repo: FullRepoMetadata["repo"];
  audit: FullRepoMetadata["audit"];
}

export function RepoHeader({ repo, audit }: RepoHeaderProps) {
  const healthPercentage = audit.score;
  const isHealthy = healthPercentage >= 80;
  const isWarning = healthPercentage >= 50 && healthPercentage < 80;

  return (
    <header className="border-b bg-background/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open repository on GitHub"
        title="Open on GitHub"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar>
            <AvatarImage src={repo.avatarUrl} alt={repo.name} />
          </Avatar>

          <h1 className="text-lg font-semibold truncate text-foreground">
            {repo.name}
          </h1>
        </div>
      </a>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isHealthy
                    ? "bg-emerald-500/80"
                    : isWarning
                    ? "bg-amber-500/80"
                    : "bg-rose-500/80"
                }`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground/70 min-w-fit">
              {audit.resolved}/{audit.total}
            </span>
          </div>
          <span className="text-xs text-muted-foreground/50">
            {healthPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </header>
  );
}
