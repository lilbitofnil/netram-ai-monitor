import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, ScanLine } from "lucide-react";

import { EmptyState, ErrorState, LoadingState, SectionHeader, StatusBadge } from "@/components/netram/ui";
import { adminTruthGap } from "@/lib/admin.functions";
import { useToken } from "@/lib/useAdminData";

export const Route = createFileRoute("/admin/truth-gap")({
  head: () => ({ meta: [
    { title: "Truth Gap Analysis — NETRAM AI" },
    { name: "description", content: "Compare inspection compliance with anonymous beneficiary satisfaction." },
    { property: "og:title", content: "Truth Gap Analysis — NETRAM AI" },
    { property: "og:description", content: "Inspection and beneficiary feedback comparison." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: TruthGapPage,
});

function TruthGapPage() {
  const token = useToken();
  const query = useQuery({ queryKey: ["admin-truth-gap"], queryFn: () => adminTruthGap({ data: { token: token as string } }), enabled: !!token });
  if (query.isLoading) return <LoadingState label="Calculating Truth Gap" />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load Truth Gap analysis." onRetry={() => query.refetch()} />;
  const summaries = new Map(query.data.summary.map((row) => [row.ngo_id, row]));
  const rows = query.data.ngos.map((ngo) => { const feedback = summaries.get(ngo.id); const satisfaction = feedback ? Math.round(Number(feedback.overall_average) * 20) : null; const gap = satisfaction === null ? null : ngo.compliance - satisfaction; return { ngo, feedback, satisfaction, gap }; });
  return <div className="mx-auto max-w-6xl"><SectionHeader title="Truth Gap Analysis" subtitle="Inspection compliance compared with anonymous beneficiary experience."/>
    <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm"><div className="flex items-center gap-2 font-bold text-primary"><ScanLine className="h-4 w-4"/>How Truth Gap works</div><p className="mt-1 text-muted-foreground">A positive gap means official inspection compliance is higher than beneficiary satisfaction. Larger gaps require closer human review.</p></div>
    <div className="grid gap-4 md:grid-cols-2">{rows.map(({ ngo, feedback, satisfaction, gap }) => { const absGap = gap === null ? null : Math.abs(gap); const tone = absGap === null ? "neutral" : absGap >= 20 ? "danger" : absGap >= 10 ? "warning" : "success"; return <article key={ngo.id} className="surface p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{ngo.name}</h2><p className="text-xs text-muted-foreground">{ngo.district}, {ngo.state}</p></div><StatusBadge label={absGap === null ? "Awaiting feedback" : absGap >= 20 ? "High gap" : absGap >= 10 ? "Review" : "Aligned"} tone={tone}/></div>
      <div className="mt-5 grid grid-cols-3 gap-3"><div><div className="text-2xl font-extrabold">{ngo.compliance}%</div><div className="label-caps">Inspection</div></div><div><div className="text-2xl font-extrabold">{satisfaction === null ? "—" : `${satisfaction}%`}</div><div className="label-caps">Beneficiary</div></div><div><div className="text-2xl font-extrabold">{absGap === null ? "—" : `${absGap} pts`}</div><div className="label-caps">Truth Gap</div></div></div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><MessageSquareText className="h-4 w-4"/>{feedback?.response_count ?? 0} responses</span><Link to="/admin/map" search={{ ngo: ngo.id }} className="font-semibold text-primary">View NGO</Link></div></article>; })}</div>
    <div className="mt-8"><SectionHeader title="Recent beneficiary comments" subtitle="Anonymous comments for authorized human review"/>{query.data.feedback.length === 0 ? <EmptyState title="No written feedback yet"/> : <div className="space-y-3">{query.data.feedback.map((item) => { const ngo = query.data.ngos.find((row) => row.id === item.ngo_id); return <div key={item.id} className="surface p-4"><div className="text-sm font-semibold">{ngo?.name ?? "NGO"}</div><p className="mt-1 text-sm text-muted-foreground">{item.comments}</p></div>; })}</div>}</div>
  </div>;
}