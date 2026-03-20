"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { OVERVIEW_LINKS } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useIsMobile } from "@/hooks/use-mobile";
import { GitBranch, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((isSearchOpen) => !isSearchOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigate = (url: string) => {
    router.push(url);
    setIsSearchOpen(false);
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

          <div className="flex-1 flex-col flex overflow-y-auto px-3 py-1 space-y-6 scrollbar-thin scrollbar-thumb-muted">
            <div className="space-y-1">
              {OVERVIEW_LINKS.map((link) => {
                const isActive = pathname === link.url;
                return (
                  <Link key={link.url} href={link.url} onClick={handleClick}>
                    <div
                      className={`p-2 rounded flex items-center gap-3 transition-all duration-200 ${
                        isActive
                          ? "bg-muted/40 text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      <link.icon
                        className={`w-4 h-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span className="text-sm">{link.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            
          </div>
        </div>
      </Sidebar>
    </>
  );
}
