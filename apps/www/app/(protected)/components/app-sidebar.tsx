"use client";

import { SidebarRepo } from "@/actions/repo";
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
import { siteConfig } from "@/config/site";
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

interface AppSidebarProps {
  initialRepos: SidebarRepo[];
}

export function AppSidebar({ initialRepos }: AppSidebarProps) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: repos } = useQuery<SidebarRepo[]>({
    queryKey: ["recent-repos"],
    initialData: initialRepos,
    staleTime: Infinity,
  });

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
      <Sidebar className="border-none!">
        <div className="flex flex-col h-full bg-background">
          <div className="p-3">
            <Link href="/dashboard" onClick={handleClick}>
              <span className="text-lg">{siteConfig.name}</span>
            </Link>
          </div>

          <div className="py-1 px-3">
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/30 hover:bg-muted/50 rounded-md transition-all duration-200 border border-border/50 cursor-pointer"
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

          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
            <div className="space-y-1">
              <Link href="/dashboard" onClick={handleClick}>
                <div
                  className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-muted/30 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm ">Dashboard</span>
                </div>
              </Link>
            </div>

            {repos.length > 0 && (
              <div className="space-y-1">
                <h3 className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </h3>
                <div className="space-y-1">
                  {repos.slice(0, 5).map((repo) => (
                    <Link
                      key={repo.id}
                      href={`/repo/${repo.id}`}
                      onClick={handleClick}
                    >
                      <div
                        className={`px-3 py-2 rounded text-foreground/80 flex items-center gap-2 transition-all duration-200 truncate ${
                          pathname === `/repo/${repo.id}`
                            ? "bg-muted/30"
                            : "hover:bg-muted/30"
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

            {repos.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No repositories yet
                </p>
              </div>
            )}
          </div>

          <div className="p-3">
            <Link href="/import" onClick={handleClick}>
              <Button
                size="sm"
                className="w-full text-foreground bg-muted/20 hover:bg-muted/30 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>New Repository</span>
              </Button>
            </Link>
          </div>
        </div>
      </Sidebar>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search repositories..." />
        <CommandList>
          <CommandEmpty>No repositories found.</CommandEmpty>
          <CommandGroup heading="Recent">
            {repos.slice(0, 5).map((repo) => (
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
