import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  FileClock,
  Bell,
  Gauge,
} from "lucide-react";

import {
  ErrorState,
  LoadingState,
  SectionHeader,
  StatCard,
  StatusBadge,
} from "@/components/netram/ui";
import { useAdminOverview } from "@/lib/useAdminData";
import { formatDate, severityTone } from "@/lib/netram";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — NETRAM AI" },
      { name: "description", content: "Real-time snapshot of NGO monitoring across districts." },
      { property: "og:title", content: "Admin Dashboard — NETRAM AI" },
      { property: "og:description", content: "Real-time snapshot of NGO monitoring across districts." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminOverview();

  if (isLoading) return <LoadingState label="Loading monitoring data" />;
  if (isError || !data)
    return <ErrorState message="Unable to connect to monitoring services." onRetry={() => refetch()} />;

  const today = new Date().toDateString();
  const todaysInspections = data.inspections.filter(
    (i) => new Date(i.created_at).toDateString() === today,
  ).length;
  const pendingReviews = data.reports.filter((r) => r.status === "under_review").length;
  const openAlerts = data.alerts.filter((a) => a.status === "open").length;
  const avgCompliance = data.ngos.length
    ? Math.round(data.ngos.reduce((s, n) => s + n.compliance, 0) / data.ngos.length)
    : 0;
  const attention = data.ngos.filter((n) => n.compliance < 80).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Monitoring Overview"
        subtitle="Real-time snapshot of NGO monitoring across districts."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Building2} label="Total NGOs" value={data.ngos.length} />
        <StatCard
          icon={CheckCircle2}
          label="Active NGOs"
          value={data.ngos.filter((n) => n.cctv_status === "active").length}
          accent="success"
        />
        <StatCard icon={ClipboardList} label="Today's Inspections" value={todaysInspections} accent="accent" />
        <StatCard icon={FileClock} label="Pending Reviews" value={pendingReviews} accent="accent" />
        <StatCard icon={Bell} label="AI Alerts" value={openAlerts} accent="destructive" />
        <StatCard icon={Gauge} label="Average Compliance" value={`${avgCompliance}%`} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface p-5">
          <SectionHeader
            title="NGOs Requiring Attention"
            subtitle="High risk or low compliance"
            action={
              <Link to="/admin/ngos" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            }
          />
          <div className="space-y-2.5">
            {attention.length === 0 && (
              <p className="text-sm text-muted-foreground">No NGOs below the compliance threshold.</p>
            )}
            {attention.map((ngo) => (
              <Link
                key={ngo.id}
                to="/admin/map"
                search={{ ngo: ngo.id }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{ngo.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {ngo.city}, {ngo.state}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{ngo.compliance}%</span>
                  <StatusBadge
                    label={ngo.risk_level}
                    tone={ngo.risk_level === "medium" ? "warning" : "danger"}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <SectionHeader
            title="Recent Alerts"
            action={
              <Link to="/admin/alerts" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            }
          />
          <div className="space-y-2.5">
            {data.alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-xl border border-border p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold">{alert.title}</div>
                  <StatusBadge label={alert.severity} tone={severityTone[alert.severity] ?? "info"} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{formatDate(alert.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
