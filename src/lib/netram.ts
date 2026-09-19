export const GEO_RADIUS_METERS = 250;

export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

export const riskTone: Record<string, "success" | "warning" | "danger" | "info"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

export const severityTone: Record<string, "success" | "warning" | "danger" | "info"> = {
  low: "info",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

export function markerColor(risk: string, compliance: number): string {
  if (risk === "critical" || risk === "high") return "#DC2626";
  if (risk === "medium" || compliance < 75) return "#FF7A00";
  if (compliance >= 85) return "#16A34A";
  return "#1557E8";
}

export const CHECKLIST_CATEGORIES: { category: string; items: string[] }[] = [
  { category: "Attendance", items: ["Register maintained", "Beneficiaries present as recorded"] },
  { category: "Infrastructure", items: ["Building condition adequate", "Sanitation facilities functional"] },
  { category: "Beneficiary Verification", items: ["Identity records available", "Sample verification completed"] },
  { category: "Documents", items: ["Utilisation certificate available", "Audited statements available"] },
  { category: "CCTV", items: ["Cameras installed", "Recording retention available"] },
  { category: "Safety", items: ["Fire safety equipment present", "Emergency exits accessible"] },
  { category: "Service Delivery", items: ["Scheme services delivered", "Grievance mechanism in place"] },
];

export type ChecklistAnswer = { category: string; item: string; answer: "yes" | "no" | "na" };

export function complianceFromChecklist(answers: ChecklistAnswer[]): number {
  const scored = answers.filter((a) => a.answer !== "na");
  if (scored.length === 0) return 0;
  return Math.round((scored.filter((a) => a.answer === "yes").length / scored.length) * 100);
}

export function formatDate(value?: string | null): string {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
