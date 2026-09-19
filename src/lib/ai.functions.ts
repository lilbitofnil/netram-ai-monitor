import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function responseText(input: unknown): Promise<{ text: string; error?: string }> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { text: "", error: "AI service is currently unavailable." };
  const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { "Lovable-API-Key": key, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: "openai/gpt-6-astra", input, stream: true, reasoning: { effort: "low", summary: "auto" }, include: ["reasoning.encrypted_content"], store: false }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`AI gateway error [${response.status}]: ${body}`);
    const error = response.status === 429 ? "AI service is busy. Please try again shortly." : response.status === 402 ? "AI credits are exhausted for this workspace." : response.status === 403 ? "AI service access is currently unavailable." : "AI service is currently unavailable.";
    return { text: "", error };
  }
  const reader = response.body?.getReader();
  if (!reader) return { text: "", error: "AI service returned no result." };
  const decoder = new TextDecoder(); let buffer = ""; let text = "";
  while (true) { const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; for (const line of lines) { if (!line.startsWith("data: ") || line === "data: [DONE]") continue; try { const event = JSON.parse(line.slice(6)) as { type?: string; delta?: string; response?: { output_text?: string } }; if (event.type === "response.output_text.delta" && event.delta) text += event.delta; if (!text && event.type === "response.completed" && event.response?.output_text) text = event.response.output_text; } catch { /* incomplete event */ } } }
  return { text };
}

export const detectAttendance = createServerFn({ method: "POST" }).inputValidator((input: unknown) => z.object({ imageDataUrl: z.string().startsWith("data:image/"), expected: z.number().int().min(0).max(1000) }).parse(input)).handler(async ({ data }) => {
  const result = await responseText([{ role: "developer", content: [{ type: "input_text", text: "Count distinct visible people in the inspection photograph. Return strict JSON only with people_count integer, confidence number 0-1, and notes string. Lower confidence when unclear." }] }, { role: "user", content: [{ type: "input_text", text: "Count visible people." }, { type: "input_image", image_url: data.imageDataUrl }] }]);
  if (result.error) return { ok: false as const, peopleCount: 0, confidence: 0, status: "mismatch" as const, notes: "", error: result.error };
  let parsed: { people_count?: number; confidence?: number; notes?: string } = {}; try { parsed = JSON.parse(result.text.replace(/^```json\s*|```$/g, "")); } catch { return { ok: false as const, peopleCount: 0, confidence: 0, status: "mismatch" as const, notes: "", error: "AI result could not be read. Please try another photograph." }; }
  const peopleCount=Math.max(0,Math.round(Number(parsed.people_count??0))); const confidence=Math.min(1,Math.max(0,Number(parsed.confidence??0))); return { ok:true as const, peopleCount, confidence, status: Math.abs(peopleCount-data.expected)<=2?"verified" as const:"mismatch" as const, notes:String(parsed.notes??"") };
});

export const generateComplianceSummary=createServerFn({method:"POST"}).inputValidator((input:unknown)=>z.object({ngoName:z.string(),compliance:z.number(),attendanceStatus:z.string(),cctvStatus:z.string(),openIssues:z.array(z.string())}).parse(input)).handler(async({data})=>{const result=await responseText([{role:"developer",content:[{type:"input_text",text:"Write a cautious three-sentence government inspection summary. Use appears, potential issue, and requires review where appropriate. Never declare fraud or definitive verification."}]},{role:"user",content:[{type:"input_text",text:JSON.stringify(data)}]}]);return {summary:result.error??result.text||"AI summary service is currently unavailable."}});
