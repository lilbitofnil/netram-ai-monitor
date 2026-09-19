import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { NetramLogo, NetramTextField, PrimaryButton } from "@/components/netram/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — NETRAM AI" },
      { name: "description", content: "Set a new password for your NETRAM AI officer account." },
      { property: "og:title", content: "Reset Password — NETRAM AI" },
      { property: "og:description", content: "Set a new password for your officer account." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/officer" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <NetramLogo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-7">
          <h1 className="text-2xl font-extrabold tracking-tight">Set a new password</h1>
          <NetramTextField
            label="New password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PrimaryButton type="submit" disabled={busy}>
            Update password
          </PrimaryButton>
        </form>
      </main>
    </div>
  );
}
