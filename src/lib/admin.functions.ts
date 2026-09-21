import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TokenInput = z.object({ token: z.string().min(1) });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { isValidAccessCode, issueAdminToken } = await import("./admin-session.server");
    if (!isValidAccessCode(data.code)) {
      return { ok: false as const };
    }
    return { ok: true as const, token: issueAdminToken() };
  });

export const adminVerify = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TokenInput.parse(input))
  .handler(async ({ data }) => {
    const { verifyAdminToken } = await import("./admin-session.server");
    return { valid: verifyAdminToken(data.token) };
  });

async function adminClient(token: string) {
  const { requireAdmin } = await import("./admin-session.server");
  requireAdmin(token);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminOverview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TokenInput.parse(input))
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const [ngos, inspections, reports, alerts, attendance] = await Promise.all([
      db.from("ngos").select("*").order("compliance", { ascending: true }),
      db.from("inspections").select("*").order("created_at", { ascending: false }).limit(100),
      db.from("reports").select("*").order("submitted_at", { ascending: false }).limit(100),
      db.from("alerts").select("*").order("created_at", { ascending: false }).limit(100),
      db.from("attendance_results").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    return {
      ngos: ngos.data ?? [],
      inspections: inspections.data ?? [],
      reports: reports.data ?? [],
      alerts: alerts.data ?? [],
      attendance: attendance.data ?? [],
    };
  });

export const adminUsers = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TokenInput.parse(input))
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const [profiles, roles] = await Promise.all([
      db.from("profiles").select("*").order("created_at", { ascending: false }),
      db.from("user_roles").select("*"),
    ]);
    return { profiles: profiles.data ?? [], roles: roles.data ?? [] };
  });

export const adminReportDetail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    TokenInput.extend({ reportId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const { data: report } = await db.from("reports").select("*").eq("id", data.reportId).maybeSingle();
    if (!report) throw new Error("Report not found");
    const [inspection, ngo, evidence, attendance] = await Promise.all([
      db.from("inspections").select("*").eq("id", report.inspection_id).maybeSingle(),
      db.from("ngos").select("*").eq("id", report.ngo_id).maybeSingle(),
      db.from("evidence").select("*").eq("inspection_id", report.inspection_id),
      db.from("attendance_results").select("*").eq("inspection_id", report.inspection_id).maybeSingle(),
    ]);
    const evidenceRows = evidence.data ?? [];
    const signed = await Promise.all(
      evidenceRows.map(async (row) => {
        const path = row.image_url;
        const { data: url } = await db.storage.from("inspection-evidence").createSignedUrl(path, 3600);
        return { ...row, signedUrl: url?.signedUrl ?? null };
      }),
    );
    return {
      report,
      inspection: inspection.data,
      ngo: ngo.data,
      evidence: signed,
      attendance: attendance.data,
    };
  });

export const adminReviewReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    TokenInput.extend({
      reportId: z.string().uuid(),
      action: z.enum(["approved", "clarification_requested", "rejected"]),
      note: z.string().max(1000).optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const { error } = await db
      .from("reports")
      .update({
        status: data.action,
        review_note: data.note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.reportId);
    if (error) throw new Error(error.message);
    await db.from("audit_log").insert({
      actor: "government_admin",
      action: data.action,
      target: `report:${data.reportId}`,
    });
    return { ok: true };
  });

export const adminAuditLog = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TokenInput.parse(input))
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const { data: rows } = await db
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return rows ?? [];
  });

export const adminTruthGap = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TokenInput.parse(input))
  .handler(async ({ data }) => {
    const db = await adminClient(data.token);
    const [ngos, summary, feedback] = await Promise.all([
      db.from("ngos").select("id,name,city,state,district,compliance").order("name"),
      db.rpc("get_public_feedback_summary"),
      db.from("beneficiary_feedback").select("id,ngo_id,comments,created_at").not("comments", "is", null).order("created_at", { ascending: false }).limit(100),
    ]);
    if (ngos.error || summary.error || feedback.error) throw new Error("Unable to load Truth Gap analysis.");
    return { ngos: ngos.data ?? [], summary: summary.data ?? [], feedback: feedback.data ?? [] };
  });
