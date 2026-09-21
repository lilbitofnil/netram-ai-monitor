import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark } from "lucide-react";

import { NetramLogo, NetramTextField, PrimaryButton } from "@/components/netram/ui";
import { adminLogin } from "@/lib/admin.functions";
import { setAdminToken } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/admin")({
  head: () => ({
    meta: [
      { title: "Government Administration Login — NETRAM AI" },
      {
        name: "description",
        content: "Authorized access for department officials to the NETRAM AI monitoring portal.",
      },
      { property: "og:title", content: "Government Administration Login — NETRAM AI" },
      { property: "og:description", content: "Authorized access for department officials." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await adminLogin({ data: { code } });
      if (!result.ok) {
        setError("Invalid access code. Please verify your credentials.");
        return;
      }
      setAdminToken(result.token);
      navigate({ to: "/admin" });
    } catch {
      setError("Unable to connect to monitoring services. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <NetramLogo />
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Back
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="surface w-full max-w-md p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Landmark className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Government Administration</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Authorized access for department officials.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <NetramTextField
              label="Admin access code"
              inputMode="numeric"
              autoComplete="one-time-code"
              type="password"
              placeholder="Enter access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <PrimaryButton type="submit" disabled={busy || code.length === 0}>
              {busy ? "Verifying" : "Login as Admin"}
            </PrimaryButton>
          </form>

        </div>
      </main>
    </div>
  );
}
