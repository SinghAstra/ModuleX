"use client";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Box, Loader2, Search, Zap } from "lucide-react";
import { useState } from "react";
import { FileTree } from "./file-tree";
// Assuming you created this server action or API caller
import { getFileDetails, getRepoTree } from "@/services/repo-service";

export function CodeExplorer({ repoId }: { repoId: string }) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // 1. Fetch the Skeleton (Tree Structure)
  const { data: treeNodes, isLoading: isTreeLoading } = useQuery({
    queryKey: ["repo-tree", repoId],
    queryFn: () => getRepoTree(repoId),
  });

  // 2. Fetch the "Nervous System" details for a specific file
  const { data: fileDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["file-details", selectedFileId],
    queryFn: () => getFileDetails(selectedFileId!),
    enabled: !!selectedFileId, // Only run when a file is selected
  });

  return (
    <div className="grid grid-cols-12 h-full bg-background">
      {/* LEFT: Skeleton (Directories & Files) */}
      <aside className="col-span-3 border-r bg-muted/20 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-muted/10">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Skeleton Explorer
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {isTreeLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Building tree...
            </div>
          ) : (
            <FileTree
              nodes={treeNodes || []}
              onFileSelect={setSelectedFileId}
              selectedFileId={selectedFileId || undefined}
            />
          )}
        </div>
      </aside>

      {/* CENTER: Metadata (Symbols & Implementation) */}
      <section className="col-span-9 overflow-y-auto">
        {selectedFileId ? (
          <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>Repository</span> /{" "}
                <span className="text-foreground/80">
                  {fileDetails?.path || "..."}
                </span>
              </div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Zap className="text-amber-500 fill-amber-500/10" /> Nervous
                System Details
              </h2>
            </div>

            {isDetailsLoading ? (
              <div className="flex items-center gap-2 py-10 justify-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" /> Parsing AST...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                {/* Symbols Panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Box className="w-4 h-4 text-emerald-500" /> Symbols
                      (Exports)
                    </h4>
                    <Badge variant="secondary">
                      {fileDetails?.symbols?.length || 0}
                    </Badge>
                  </div>
                  <div className="border rounded-xl bg-muted/5 divide-y overflow-hidden">
                    {fileDetails?.symbols?.map((symbol: any) => (
                      <div
                        key={symbol.id}
                        className="p-3 text-xs font-mono group hover:bg-muted/20 transition-colors flex items-center justify-between"
                      >
                        <span className="text-emerald-600">
                          {symbol.type}{" "}
                          <span className="text-foreground">{symbol.name}</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {fileDetails?.symbols?.length === 0 && (
                      <div className="p-8 text-center text-xs text-muted-foreground italic">
                        No public symbols found
                      </div>
                    )}
                  </div>
                </div>

                {/* Dependencies Panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" /> Dependencies
                      (Imports)
                    </h4>
                    <Badge variant="secondary">
                      {fileDetails?.dependencies?.length || 0}
                    </Badge>
                  </div>
                  <div className="border rounded-xl bg-muted/5 divide-y overflow-hidden">
                    {fileDetails?.dependencies?.map((dep: any) => (
                      <div
                        key={dep.id}
                        className="p-3 text-xs flex justify-between items-center hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono text-foreground/80">
                            {dep.sourceValue}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Path: {dep.importPath}
                          </span>
                        </div>
                        {dep.resolvedFileId ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-rose-500 border-rose-500/20"
                          >
                            External
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-4">
            <div className="p-6 rounded-full bg-muted/20">
              <Search className="w-12 h-12" />
            </div>
            <p className="text-sm font-medium">
              Select a file from the skeleton to inspect its synapses.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
