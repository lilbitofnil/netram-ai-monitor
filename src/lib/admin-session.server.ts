import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const value = process.env["ADMIN_SESSION_SECRET"];
  if (!value) throw new Error("Admin session is not configured.");
  return value;
}

export function issueAdminToken(hours = 12): string {
  const exp = String(Date.now() + hours * 3600_000);
  const sig = createHmac("sha256", secret()).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(exp).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function requireAdmin(token: string | undefined | null): void {
  if (!verifyAdminToken(token)) throw new Error("Unauthorized administration session.");
}

export function isValidAccessCode(code: string): boolean {
  const codes = (process.env["ADMIN_ACCESS_CODES"] ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  return codes.includes(code.trim());
}
