"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Files,
  ClipboardList,
  Settings,
  LogOut,
  FileText,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

const sidebarItems = [
  {
    href: "/dashboard",
    title: "Overview",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    href: "/dashboard/files",
    title: "Documents",
    icon: <Files className="mr-2 h-4 w-4" />,
  },
  {
    href: "/dashboard/audit-logs",
    title: "Audit Logs",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
  },
  {
    href: "/dashboard/settings",
    title: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function Sidebar({ className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn("pb-12 border-r bg-background w-64 h-screen", className)}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard" className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">DocSecure</h2>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <Button
                key={`{item.href}-${index}`}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-secondary" : "hover:bg-accent"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
