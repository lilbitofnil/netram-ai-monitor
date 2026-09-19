import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, FileCheck2, MapPin } from "lucide-react";

import { MapLegend, MapPanel, type MapNgo } from "@/components/netram/MapPanel";
import { ErrorState, LoadingState, SectionHeader, StatusBadge } from "@/components/netram/ui";
import { formatDate, riskTone } from "@/lib/netram";
import { useAdminOverview } from "@/lib/useAdminData";

export const Route = createFileRoute("/admin/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    ngo: typeof search["ngo"] === "string" ? search["ngo"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Survey Coverage Map — NETRAM AI" },
      { name: "description", content: "View NGO survey coverage, verification and report status on the map." },
      { property: "og:title", content: "Survey Coverage Map — NETRAM AI" },
      { property: "og:description", content: "View NGO survey coverage, verification and report status on the map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { ngo: requestedNgo } = Route.useSearch();
  const { data, isLoading, isError, refetch } = useAdminOverview();
  const [selected, setSelected] = useState<MapNgo | null>(null);

  useEffect(() => {
    if (!data || !requestedNgo) return;
    const match = data.ngos.find((ngo) => ngo.id === requestedNgo);
    if (match) setSelected(match);
  }, [data, requestedNgo]);

  const survey = useMemo(() => {
    if (!data || !selected) return null;
    const inspections = data.inspections.filter((item) => item.ngo_id === selected.id);
    const reports = data.reports.filter((item) => item.ngo_id === selected.id);
    return {
      inspections,
      reports,
      latest: inspections[0],
      review: reports.find((item) => item.status === "under_review") ?? reports[0],
      verified: inspections.filter((item) => item.location_verified).length,
    };
  }, [data, selected]);

  if (isLoading) return <LoadingState label="Loading map data" />;
  if (isError || !data) return <ErrorState message="Unable to connect to monitoring services." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader title="Survey Coverage Map" subtitle="Select a marker to see survey activity for each NGO" />
      <MapPanel ngos={data.ngos} onSelect={setSelected} selectedId={selected?.id} />
      <MapLegend />

      {!selected && (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm font-medium text-primary">
          Select an NGO marker to view surveys, location verification and report status.
        </div>
      )}

      {selected && survey && (
        <section className="surface mt-4 p-5" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="label-caps text-primary">Selected NGO</div>
              <h2 className="mt-1 text-lg font-bold">{selected.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {selected.district}, {selected.state}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={`${selected.risk_level} risk`} tone={riskTone[selected.risk_level] ?? "neutral"} />
              <StatusBadge label={`CCTV ${selected.cctv_status}`} tone={selected.cctv_status === "active" ? "success" : "warning"} />
            </div>
          </div>

          <div className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
            <SurveyMetric icon={ClipboardCheck} value={survey.inspections.length} label="Total surveys" />
            <SurveyMetric icon={MapPin} value={survey.verified} label="Location verified" tone="text-success" />
            <SurveyMetric icon={FileCheck2} value={survey.reports.length} label="Reports filed" tone="text-accent" />
            <SurveyMetric icon={CalendarDays} value={formatDate(survey.latest?.created_at ?? selected.last_inspection)} label="Latest survey" compact />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div><span className="text-2xl font-extrabold">{selected.compliance}%</span><span className="ml-2 text-sm text-muted-foreground">overall compliance</span></div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/inspections" search={{ ngo: selected.id }} className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary">View surveys</Link>
              {survey.review && (
                <Link to="/admin/reports/$reportId" params={{ reportId: survey.review.id }} className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-deep">
                  {survey.review.status === "under_review" ? "Review and decide" : "View report"}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SurveyMetric({ icon: Icon, value, label, tone = "text-primary", compact = false }: { icon: typeof ClipboardCheck; value: string | number; label: string; tone?: string; compact?: boolean }) {
  return <div className="rounded-xl bg-muted p-4"><Icon className={`h-5 w-5 ${tone}`} /><div className={`mt-3 font-extrabold ${compact ? "text-sm" : "text-2xl"}`}>{value}</div><div className="label-caps mt-1">{label}</div></div>;
}