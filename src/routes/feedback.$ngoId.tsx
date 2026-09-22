import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { ErrorState, LoadingState, NetramLogo, PrimaryButton, SecondaryButton } from "@/components/netram/ui";
import { getPublicFeedback, submitPublicFeedback } from "@/lib/feedback.functions";

export const Route = createFileRoute("/feedback/$ngoId")({
  head: () => ({ meta: [
    { title: "NGO Feedback Scorecard — NETRAM AI" },
    { name: "description", content: "Review aggregated service ratings and submit anonymous beneficiary feedback." },
    { property: "og:title", content: "NGO Feedback Scorecard — NETRAM AI" },
    { property: "og:description", content: "Anonymous NGO service feedback and aggregated ratings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: FeedbackForm,
});

const categories = [
  ["Overall Satisfaction", "overallRating"], ["Cleanliness", "cleanlinessRating"],
  ["Staff Behaviour", "staffBehaviourRating"], ["Food / Basic Facilities", "facilitiesRating"], ["Safety", "safetyRating"],
] as const;

function FeedbackForm() {
  const { ngoId } = Route.useParams();
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["public-feedback"], queryFn: () => getPublicFeedback() });
  const ngo = query.data?.ngos.find((row) => row.id === ngoId);
  const summary = query.data?.summary.find((row) => row.ngo_id === ngoId);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [promised, setPromised] = useState<boolean | null>(null);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionKey, setSubmissionKey] = useState<string | null>(null);
  useEffect(() => {
    const storageKey = `netram-feedback-${ngoId}`;
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      setSubmissionKey(existing);
      return;
    }
    const value = crypto.randomUUID();
    localStorage.setItem(storageKey, value);
    setSubmissionKey(value);
  }, [ngoId]);
  const mutation = useMutation({ mutationFn: () => submitPublicFeedback({ data: {
    ngoId, submissionKey: submissionKey ?? "", overallRating: ratings["overallRating"] ?? 0,
    cleanlinessRating: ratings["cleanlinessRating"] ?? 0, staffBehaviourRating: ratings["staffBehaviourRating"] ?? 0,
    facilitiesRating: ratings["facilitiesRating"] ?? 0, safetyRating: ratings["safetyRating"] ?? 0,
    promisedServices: promised === true, comments,
  }}), onSuccess: async () => { setSubmitted(true); await qc.invalidateQueries({ queryKey: ["public-feedback"] }); } });
  if (query.isLoading) return <LoadingState label="Loading scorecard" />;
  if (query.isError || !ngo) return <ErrorState message="This NGO scorecard could not be loaded." onRetry={() => query.refetch()} />;
  const ready = Boolean(submissionKey) && categories.every(([, keyName]) => ratings[keyName]) && promised !== null;
  if (submitted) return <div className="flex min-h-screen items-center justify-center bg-background p-6"><div className="surface max-w-md p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-success"/><h1 className="mt-4 text-2xl font-extrabold">Feedback Submitted</h1><p className="mt-2 text-sm text-muted-foreground">Thank you. Your anonymous response is included in the public scorecard and Truth Gap analysis.</p><Link to="/feedback" className="mt-6 inline-flex text-sm font-semibold text-primary">Return to scorecards</Link></div></div>;
  return <div className="min-h-screen bg-background"><header className="border-b border-border bg-card"><div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4"><NetramLogo/><Link to="/feedback" className="text-sm font-semibold text-muted-foreground">Back</Link></div></header>
    <main className="mx-auto max-w-3xl px-5 py-8"><h1 className="text-2xl font-extrabold">{ngo.name}</h1><p className="text-sm text-muted-foreground">{ngo.city}, {ngo.state}</p>
      <div className="surface mt-5 grid gap-4 p-5 sm:grid-cols-3"><div><div className="text-3xl font-extrabold text-primary">{summary ? `${Math.round(Number(summary.overall_average) * 20)}%` : "—"}</div><div className="label-caps">Satisfaction</div></div><div><div className="text-3xl font-extrabold">{summary?.response_count ?? 0}</div><div className="label-caps">Responses</div></div><div><div className="text-3xl font-extrabold">{summary?.promised_services_percentage ?? "—"}{summary ? "%" : ""}</div><div className="label-caps">Services delivered</div></div></div>
      <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="mt-5 space-y-4">{categories.map(([label, keyName]) => <fieldset key={keyName} className="surface p-5"><legend className="font-bold">{label}</legend><div className="mt-3 grid grid-cols-5 gap-2">{[1,2,3,4,5].map((value) => <SecondaryButton key={value} type="button" aria-label={`${label}: ${value} out of 5`} onClick={() => setRatings((current) => ({ ...current, [keyName]: value }))} className={ratings[keyName] === value ? "border-primary bg-primary/10 text-primary" : ""}><Star className={`h-4 w-4 ${ratings[keyName] === value ? "fill-current" : ""}`}/>{value}</SecondaryButton>)}</div></fieldset>)}
        <fieldset className="surface p-5"><legend className="font-bold">Were promised services actually provided?</legend><div className="mt-3 grid grid-cols-2 gap-3"><SecondaryButton type="button" onClick={() => setPromised(true)} className={promised === true ? "border-success bg-success/10 text-success" : ""}>Yes</SecondaryButton><SecondaryButton type="button" onClick={() => setPromised(false)} className={promised === false ? "border-destructive bg-destructive/10 text-destructive" : ""}>No</SecondaryButton></div></fieldset>
        <label className="surface block p-5"><span className="font-bold">Additional feedback <span className="font-normal text-muted-foreground">(optional)</span></span><textarea value={comments} onChange={(e) => setComments(e.target.value)} maxLength={1000} rows={4} className="mt-3 w-full resize-none rounded-xl border border-input bg-card p-3 text-sm outline-none focus:border-primary" placeholder="Share your experience without including personal information."/></label>
        {mutation.isError && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{mutation.error instanceof Error ? mutation.error.message : "Feedback could not be submitted."}</div>}
        <PrimaryButton type="submit" disabled={!ready || mutation.isPending}>{mutation.isPending ? "Submitting" : "Submit Anonymous Feedback"}</PrimaryButton>
      </form>
    </main></div>;
}