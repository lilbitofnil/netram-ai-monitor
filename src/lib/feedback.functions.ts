import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubmissionSchema = z.object({
  ngoId: z.string().uuid(),
  submissionKey: z.string().uuid(),
  overallRating: z.number().int().min(1).max(5),
  cleanlinessRating: z.number().int().min(1).max(5),
  staffBehaviourRating: z.number().int().min(1).max(5),
  facilitiesRating: z.number().int().min(1).max(5),
  safetyRating: z.number().int().min(1).max(5),
  promisedServices: z.boolean(),
  comments: z.string().trim().max(1000).optional(),
});

export const getPublicFeedback = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [ngos, summary] = await Promise.all([
    supabaseAdmin.from("ngos").select("id,name,city,state,district,compliance").order("name"),
    supabaseAdmin.rpc("get_public_feedback_summary"),
  ]);
  if (ngos.error || summary.error) throw new Error("Unable to load public feedback.");
  return { ngos: ngos.data ?? [], summary: summary.data ?? [] };
});

export const submitPublicFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ngo } = await supabaseAdmin.from("ngos").select("id").eq("id", data.ngoId).maybeSingle();
    if (!ngo) throw new Error("NGO not found.");
    const { error } = await supabaseAdmin.from("beneficiary_feedback").insert({
      ngo_id: data.ngoId,
      submission_key: data.submissionKey,
      overall_rating: data.overallRating,
      cleanliness_rating: data.cleanlinessRating,
      staff_behaviour_rating: data.staffBehaviourRating,
      facilities_rating: data.facilitiesRating,
      safety_rating: data.safetyRating,
      promised_services: data.promisedServices,
      comments: data.comments || null,
    });
    if (error?.code === "23505") throw new Error("Feedback has already been submitted from this browser.");
    if (error) throw new Error("Feedback could not be submitted.");
    return { ok: true as const };
  });