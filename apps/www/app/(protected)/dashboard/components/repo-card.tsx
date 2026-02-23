import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Github, Layers } from "lucide-react";
import Link from "next/link";

export function RepoCard({ repo }: any) {
  const isProcessing = repo.status === "PROCESSING" || repo.status === "QUEUED";

  return (
    <Card className="group hover:border-primary/50 transition-all shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Github className="w-6 h-6" />
        </div>
        <div className="flex-1 truncate">
          <h3 className="font-bold truncate">{repo.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{repo.url}</p>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span>{repo._count.files} Files</span>
          </div>
          <Badge
            variant={isProcessing ? "outline" : "default"}
            className={isProcessing ? "animate-pulse" : ""}
          >
            {repo.status}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 p-3">
        <Link
          href={`/repo/${repo.id}`}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary group-hover:underline"
        >
          {isProcessing ? "View Progress" : "Explore Implementation"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
