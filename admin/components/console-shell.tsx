"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ClipboardList,
  FileKey2,
  FileUp,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  Menu,
  ScanSearch,
  Shield,
  Webhook,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "General",
    items: [{ href: "/", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Policies",
    items: [
      { href: "/policies", label: "All policies", icon: Shield },
      { href: "/policies/import", label: "Import", icon: FileUp },
    ],
  },
  {
    label: "Compliance",
    items: [
      { href: "/dsar", label: "DSAR", icon: FileKey2 },
      { href: "/audit", label: "Audit", icon: ClipboardList },
      { href: "/enforce", label: "Enforce", icon: Activity },
    ],
  },
  {
    label: "Integrations",
    items: [{ href: "/webhooks", label: "Webhooks", icon: Webhook }],
  },
  {
    label: "AI",
    items: [
      { href: "/evaluate", label: "Evaluate", icon: FlaskConical },
      { href: "/classify", label: "Scan", icon: ScanSearch },
      { href: "/observability", label: "Observability", icon: LineChart },
    ],
  },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ConsoleShell({
  children,
  apiUrl,
}: {
  children: React.ReactNode;
  apiUrl: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const nav = (
    <div className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-fg">
            {group.label}
          </p>
          <nav className="flex flex-col gap-0.5" aria-label={group.label}>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 border-l-[3px] px-3 py-2 text-sm transition-colors duration-200 cursor-pointer",
                    active
                      ? "border-nav-active-border bg-nav-active-bg font-medium text-foreground"
                      : "border-transparent text-muted-fg hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden cursor-pointer"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar-bg transition-transform duration-200 md:static md:translate-x-0 md:shrink-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-foreground">
              DRPE Admin
            </p>
            <p className="truncate font-mono text-[10px] text-muted-fg" title={apiUrl}>
              {apiUrl}
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-foreground hover:bg-muted cursor-pointer md:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">{nav}</div>

        <div className="border-t border-border p-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center border-b border-border bg-surface px-4 md:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-foreground hover:bg-muted cursor-pointer"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main id="main" className="min-w-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
