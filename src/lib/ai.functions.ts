import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DetectInput = z.object({
  imageDataUrl: z.string().startsWith("data:image/"),
  expected: z.number().int().min(0).max(1000),
});

type DetectResult = {
  ok: boolean;
  peopleCount: number;
  confidence: number;
  status: "verified" | "mismatch";
  notes: string;
  error?: string;
};

export const detectAttendance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DetectInput.parse(input))
  .handler(async ({ data }): Promise<DetectResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return {
        ok: false,
        peopleCount: 0,
        confidence: 0,
        status: "mismatch",
        notes: "",
        error: "AI verification service is currently unavailable.",
      };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You count distinct people visible in an inspection photograph. Reply with JSON only: {\"people_count\": number, \"confidence\": number between 0 and 1, \"notes\": short sentence}. Never guess wildly; lower the confidence when the scene is crowded or unclear.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Count the people visible in this photograph." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`AI gateway error [${response.status}]: ${body}`);
      const message =
        response.status === 429
          ? "AI verification is rate limited. Please try again shortly."
          : response.status === 402
            ? "AI credits are exhausted for this workspace."
            : "AI verification service is currently unavailable.";
      return { ok: false, peopleCount: 0, confidence: 0, status: "mismatch", notes: "", error: message };
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "{}";
    let parsed: { people_count?: number; confidence?: number; notes?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
    const peopleCount = Math.max(0, Math.round(Number(parsed.people_count ?? 0)));
    const confidence = Math.min(1, Math.max(0, Number(parsed.confidence ?? 0.6)));
    const difference = peopleCount - data.expected;
    return {
      ok: true,
      peopleCount,
      confidence,
      status: Math.abs(difference) <= 2 ? "verified" : "mismatch",
      notes: String(parsed.notes ?? ""),
    };
  });

export const generateComplianceSummary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        ngoName: z.string(),
        compliance: z.number(),
        attendanceStatus: z.string(),
        cctvStatus: z.string(),
        openIssues: z.array(z.string()),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { summary: "AI summary service is currently unavailable." };
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You write cautious, three-sentence compliance summaries for a government inspection report. Use hedged language such as 'appears', 'potential issue', 'requires review'. Never declare fraud or definitive verification. No emojis.",
          },
          { role: "user", content: JSON.stringify(data) },
        ],
      }),
    });
    if (!response.ok) {
      console.error(`AI summary error [${response.status}]: ${await response.text()}`);
      return { summary: "AI summary service is currently unavailable." };
    }
    const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return { summary: payload.choices?.[0]?.message?.content?.trim() ?? "" };
  });
