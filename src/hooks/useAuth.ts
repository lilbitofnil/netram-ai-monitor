import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  district: string;
  created_at: string;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (!next) setProfile(null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!active) return;
      if (data) {
        setProfile(data as Profile);
      } else {
        const fallback = {
          id: user.id,
          name:
            (user.user_metadata?.["full_name"] as string) ??
            (user.user_metadata?.["name"] as string) ??
            user.email?.split("@")[0] ??
            "Officer",
          email: user.email ?? "",
          photo_url: (user.user_metadata?.["avatar_url"] as string) ?? null,
          district: "Unassigned",
        };
        await supabase.from("profiles").insert(fallback);
        const { data: created } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (active && created) setProfile(created as Profile);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  return { session, user, profile, loading, setProfile };
}

export const ADMIN_TOKEN_KEY = "netram_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}
