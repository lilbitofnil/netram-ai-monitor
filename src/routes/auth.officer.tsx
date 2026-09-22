import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { NetramLogo, NetramTextField, PrimaryButton, SecondaryButton } from "@/components/netram/ui";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/officer")({
  head: () => ({
    meta: [
      { title: "Inspection Officer Login — NETRAM AI" },
      {
        name: "description",
        content: "Sign in with Google or email to conduct field inspections and submit evidence.",
      },
      { property: "og:title", content: "Inspection Officer Login — NETRAM AI" },
      { property: "og:description", content: "Conduct field inspections and submit evidence." },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfficerLogin,
});

type Mode = "signin" | "register" | "forgot";

function OfficerLogin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/officer" });
  }, [user, loading, navigate]);

  async function signInWithGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in could not be completed.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/officer" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/officer" });
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm your address.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
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
          <h1 className="text-2xl font-extrabold tracking-tight">Inspection Officer Portal</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Conduct field inspections and submit geo-tagged evidence.
          </p>

          <SecondaryButton onClick={signInWithGoogle} disabled={busy} className="mt-6 w-full">
            <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.9-2.1 5.3-4.5 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.8z" />
              <path fill="#FBBC05" d="M10.3 28.7a14.5 14.5 0 010-9.4l-7.8-6.1a24 24 0 000 21.6l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.6l-7.1-5.5c-2 1.4-4.7 2.3-8.2 2.3-6.4 0-11.8-3.7-13.7-9.1l-7.8 6.1C6.4 42.6 14.6 48 24 48z" />
            </svg>
            Continue with Google
          </SecondaryButton>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="label-caps">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <NetramTextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Officer name"
                required
              />
            )}
            <NetramTextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@gov.in"
              required
            />
            {mode !== "forgot" && (
              <NetramTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                minLength={6}
                required
              />
            )}
            <PrimaryButton type="submit" disabled={busy}>
              {mode === "signin" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
            </PrimaryButton>
          </form>

          <div className="mt-5 flex justify-between text-sm">
            <button
              onClick={() => setMode(mode === "register" ? "signin" : "register")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "register" ? "Have an account? Sign in" : "Register"}
            </button>
            <button
              onClick={() => setMode("forgot")}
              className="font-semibold text-muted-foreground hover:text-foreground"
            >
              Forgot password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
