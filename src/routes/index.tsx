import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Landmark, MessageSquareText, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { NetramLogo } from "@/components/netram/ui";
import { getAdminToken, useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NETRAM AI — Smart NGO Monitoring & Inspection Platform" },
      {
        name: "description",
        content:
          "Choose the government administration portal or the inspection officer portal to begin monitoring NGOs funded under government schemes.",
      },
      { property: "og:title", content: "NETRAM AI — Smart NGO Monitoring & Inspection Platform" },
      {
        property: "og:description",
        content: "Real-time NGO monitoring. Smarter inspections. Evidence-driven compliance.",
      },
    ],
  }),
  component: Landing,
});

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
        <ShieldCheck className="h-8 w-8 text-primary-foreground" strokeWidth={2.2} />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          NETRAM <span className="text-accent">AI</span>
        </h1>
        <p className="label-caps mt-2">AI-powered NGO monitoring</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Department of Social Justice &amp; Empowerment
        </p>
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (booting || loading) return;
    if (getAdminToken()) navigate({ to: "/admin" });
    else if (user) navigate({ to: "/officer" });
  }, [booting, loading, user, navigate]);

  if (booting || loading) return <Splash />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <NetramLogo />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="label-caps text-primary">Ministry of Social Justice &amp; Empowerment</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Smart NGO Monitoring &amp; Inspection Platform
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Real-time NGO monitoring. Smarter inspections. Evidence-driven compliance.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <button
            onClick={() => navigate({ to: "/auth/admin" })}
            className="surface group p-6 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Landmark className="h-5 w-5 text-primary" strokeWidth={2.2} />
            </div>
            <h2 className="mt-5 text-lg font-bold tracking-tight">Government Administration</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage monitoring, inspections and compliance across districts.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Continue as Admin
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <button
            onClick={() => navigate({ to: "/auth/officer" })}
            className="surface group p-6 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
              <Building2 className="h-5 w-5 text-accent" strokeWidth={2.2} />
            </div>
            <h2 className="mt-5 text-lg font-bold tracking-tight">Inspection Officer</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Conduct field inspections and submit geo-tagged evidence.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              Continue as Officer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <button
            onClick={() => navigate({ to: "/feedback" })}
            className="surface group p-6 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
              <MessageSquareText className="h-5 w-5 text-success" strokeWidth={2.2} />
            </div>
            <h2 className="mt-5 text-lg font-bold tracking-tight">NGO &amp; Public Feedback</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Beneficiaries can submit anonymous service feedback.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-success">
              Open Public Scorecard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["Geo-tagged evidence", "Location verified within a configurable radius."],
            ["AI-assisted attendance", "Photograph-based counts reviewed by the officer."],
            ["Compliance monitoring", "Scores, alerts and CCTV status in one place."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <div className="text-sm font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
