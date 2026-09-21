import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Map as MapIcon,
  Bell,
  FileText,
  Users,
  LineChart,
  Video,
  LogOut,
  ScanLine,
} from "lucide-react";

import { LoadingState, NetramLogo } from "@/components/netram/ui";
import { adminVerify } from "@/lib/admin.functions";
import { clearAdminToken, getAdminToken } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/ngos", label: "NGOs", icon: Building2 },
  { to: "/admin/inspections", label: "Inspections", icon: ClipboardList },
  { to: "/admin/map", label: "Live Map", icon: MapIcon },
  { to: "/admin/alerts", label: "Alerts", icon: Bell },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/truth-gap", label: "Truth Gap", icon: ScanLine },
  { to: "/admin/cctv", label: "CCTV", icon: Video },
  { to: "/admin/analytics", label: "AI Analytics", icon: LineChart },
  { to: "/admin/users", label: "Users", icon: Users },
];

export function useAdminToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => setToken(getAdminToken()), []);
  return token;
}

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => setToken(getAdminToken()), []);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-session", token],
    queryFn: () => adminVerify({ data: { token: token as string } }),
    enabled: !!token,
  });

  useEffect(() => {
    if (token === null) navigate({ to: "/auth/admin" });
    if (data && !data.valid) {
      clearAdminToken();
      navigate({ to: "/auth/admin" });
    }
  }, [token, data, navigate]);

  if (token === undefined || (token && isLoading)) return <LoadingState label="Verifying session" />;
  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <NetramLogo />
        <p className="label-caps mt-6">Government Portal</p>
        <p className="-mt-0.5 text-xs font-medium text-muted-foreground">Administration</p>
        <nav className="mt-5 flex-1 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            clearAdminToken();
            navigate({ to: "/" });
          }}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/5"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card px-5 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <NetramLogo compact />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight">Government Monitoring Portal</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  System Operational
                </div>
              </div>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Admin Session
            </span>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
