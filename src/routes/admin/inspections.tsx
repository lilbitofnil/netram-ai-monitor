import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";

import { EmptyState, ErrorState, LoadingState, SectionHeader, StatusBadge } from "@/components/netram/ui";
import { formatDate } from "@/lib/netram";
import { useAdminOverview } from "@/lib/useAdminData";

export const Route = createFileRoute("/admin/inspections")({
  validateSearch: (search: Record<string, unknown>) => ({
    ngo: typeof search.ngo === "string" ? search.ngo : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Inspections — NETRAM AI" },
      { name: "description", content: "Track inspection activity and completion status." },
      { property: "og:title", content: "Inspections — NETRAM AI" },
      { property: "og:description", content: "Track inspection activity and completion status." },
    ],
  }),
  component: InspectionsPage,
});

function InspectionsPage() {
  const { ngo: ngoFilter } = Route.useSearch();
  const { data, isLoading, isError, refetch } = useAdminOverview();
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message="Unable to connect to monitoring services." onRetry={() => refetch()} />;

  const ngoName = (id: string) => data.ngos.find((ngo) => ngo.id === id)?.name ?? "Unknown NGO";
  const rows = ngoFilter ? data.inspections.filter((inspection) => inspection.ngo_id === ngoFilter) : data.inspections;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title={ngoFilter ? `${ngoName(ngoFilter)} Surveys` : "Inspections"}
        subtitle={ngoFilter ? `${rows.length} survey records found for this NGO` : "Field inspection activity and submissions"}
        action={ngoFilter ? <Link to="/admin/inspections" search={{}} className="text-sm font-semibold text-primary hover:underline">Show all</Link> : undefined}
      />
      {rows.length === 0 ? (
        <EmptyState title="No inspections submitted" description="Officer inspection activity will appear here." />
      ) : (
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50"><tr>{["NGO", "Type", "Location", "Created", "Status", "Action"].map((heading) => <th key={heading} className="px-4 py-3 label-caps">{heading}</th>)}</tr></thead>
              <tbody>
                {rows.map((inspection) => {
                  const report = data.reports.find((item) => item.inspection_id === inspection.id);
                  return (
                    <tr key={inspection.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 font-semibold"><span className="inline-flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" />{ngoName(inspection.ngo_id)}</span></td>
                      <td className="px-4 py-4">{inspection.inspection_type}</td>
                      <td className="px-4 py-4"><StatusBadge label={inspection.location_verified ? "verified" : "unverified"} tone={inspection.location_verified ? "success" : "warning"} /></td>
                      <td className="px-4 py-4 text-muted-foreground">{formatDate(inspection.created_at)}</td>
                      <td className="px-4 py-4"><StatusBadge label={inspection.status.replaceAll("_", " ")} tone={inspection.status === "submitted" ? "success" : "info"} /></td>
                      <td className="px-4 py-4">{report ? <Link to="/admin/reports/$reportId" params={{ reportId: report.id }} className="font-semibold text-primary hover:underline">{report.status === "under_review" ? "Review" : "View report"}</Link> : <span className="text-muted-foreground">No report</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}