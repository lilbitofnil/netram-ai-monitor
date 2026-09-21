import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageSquareText, Star } from "lucide-react";

import { ErrorState, LoadingState, NetramLogo } from "@/components/netram/ui";
import { getPublicFeedback } from "@/lib/feedback.functions";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [
    { title: "Public Beneficiary Feedback — NETRAM AI" },
    { name: "description", content: "Submit anonymous feedback and view aggregated NGO service scorecards." },
    { property: "og:title", content: "Public Beneficiary Feedback — NETRAM AI" },
    { property: "og:description", content: "Anonymous beneficiary feedback for monitored NGO services." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: FeedbackDirectory,
});

function FeedbackDirectory() {
  const query = useQuery({ queryKey: ["public-feedback"], queryFn: () => getPublicFeedback() });
  if (query.isLoading) return <LoadingState label="Loading scorecards" />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load public scorecards." onRetry={() => query.refetch()} />;
  const summaries = new Map(query.data.summary.map((row) => [row.ngo_id, row]));
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card"><div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4"><NetramLogo/><Link to="/" className="text-sm font-semibold text-muted-foreground">Back</Link></div></header>
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="text-center"><MessageSquareText className="mx-auto h-8 w-8 text-primary"/><h1 className="mt-3 text-3xl font-extrabold">Public Beneficiary Pulse</h1><p className="mt-2 text-sm text-muted-foreground">Anonymous feedback scorecards across monitored facilities.</p></div>
      <div className="mt-8 space-y-4">{query.data.ngos.map((ngo) => { const score = summaries.get(ngo.id); return <article key={ngo.id} className="surface p-5">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-bold">{ngo.name}</h2><p className="text-sm text-muted-foreground">{ngo.city}, {ngo.state}</p></div><div className="text-right"><div className="flex items-center justify-end gap-1 font-extrabold text-accent"><Star className="h-4 w-4 fill-current"/>{score?.overall_average ?? "—"}</div><div className="text-xs text-muted-foreground">{score?.response_count ?? 0} responses</div></div></div>
        <Link to="/feedback/$ngoId" params={{ ngoId: ngo.id }} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-deep">Open Scorecard <ArrowRight className="h-4 w-4"/></Link>
      </article>; })}</div>
    </main>
  </div>;
}