import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  shortcut?: string;
}

export const OVERVIEW_LINKS: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];
