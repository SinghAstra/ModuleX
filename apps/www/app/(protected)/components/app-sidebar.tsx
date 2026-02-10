"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import {
  GitBranch,
  Home,
  LayoutGrid,
  LucideIcon,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarNavItem {
  url: string;
  title: string;
  icon: LucideIcon;
}

const sidebarNav: SidebarNavItem[] = [
  {
    url: "/dashboard",
    title: "Repositories",
    icon: LayoutGrid,
  },
];

interface Repository {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: repos } = useQuery({
    queryKey: ['recent-repos'],
    initialData: initialRepos, 
    staleTime: Infinity,       
  });

  // Keyboard shortcut: Cmd+K to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigate = (url: string) => {
    router.push(url);
    setOpen(false);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      <Sidebar className="border-r border-border/50 bg-background">
        <div className="flex flex-col h-full">
          {/* Logo/Branding */}
          <div className="p-4 border-b border-border/30">
            <Link href="/dashboard" onClick={handleClick}>
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-accent" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Repolyze
                </span>
              </div>
            </Link>
          </div>

          {/* Search/Quick Action */}
          <div className="px-3 py-3 border-b border-border/30">
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/30 hover:bg-muted/50 rounded-md transition-all duration-200 border border-border/50"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search repos...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground border border-border/50">
                <span className="text-xs">⌘</span>
                <span>K</span>
              </kbd>
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Overview Section */}
            <div className="space-y-1">
              <h3 className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overview
              </h3>
              <Link href="/dashboard" onClick={handleClick}>
                <div
                  className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
              </Link>
            </div>

            {/* Recent Repositories Section */}
            {repos.length > 0 && (
              <div className="space-y-1">
                <h3 className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </h3>
                <div className="space-y-1">
                  {repos.slice(0, 5).map((repo) => (
                    <Link
                      key={repo.id}
                      href={`/repositories/${repo.id}`}
                      onClick={handleClick}
                    >
                      <div
                        className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-200 truncate ${
                          pathname === `/repositories/${repo.id}`
                            ? "bg-accent/15 text-accent"
                            : "text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        <GitBranch className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{repo.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && repositories.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No repositories yet
                </p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-3 border-t border-border/30 space-y-2">
            <Link href="/import-repository" onClick={handleClick}>
              <Button
                size="sm"
                className="w-full bg-accent/20 text-accent hover:bg-accent/30 transition-all duration-200"
                variant="ghost"
              >
                <Plus className="w-4 h-4" />
                <span>New Repository</span>
              </Button>
            </Link>
          </div>
        </div>
      </Sidebar>

      {/* Command Dialog for search */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search repositories..." />
        <CommandList>
          <CommandEmpty>No repositories found.</CommandEmpty>
          <CommandGroup heading="Recent">
            {repositories.slice(0, 5).map((repo) => (
              <CommandItem
                key={repo.id}
                value={repo.name}
                onSelect={() => handleNavigate(`/repositories/${repo.id}`)}
              >
                <GitBranch className="mr-2 h-4 w-4" />
                <span>{repo.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => handleNavigate("/import-repository")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Import New Repository</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
