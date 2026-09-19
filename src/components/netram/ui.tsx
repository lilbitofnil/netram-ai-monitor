import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Loader2, ShieldCheck, Inbox, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function NetramLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary">
        <ShieldCheck className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-[15px] font-extrabold tracking-tight text-foreground">
            NETRAM <span className="text-accent">AI</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const toneMap = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-accent/10 text-accent border-accent/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-primary/10 text-primary border-primary/20",
  neutral: "bg-muted text-muted-foreground border-border",
} as const;

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof toneMap;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        toneMap[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function NetramCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("surface p-5", className)}>{children}</div>;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "primary",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: "primary" | "accent" | "success" | "destructive";
  hint?: string;
}) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="surface p-4">
      <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-[10px]", accents[accent])}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </div>
      <div className="text-[26px] font-extrabold leading-none tracking-tight text-foreground">{value}</div>
      <div className="label-caps mt-2">{label}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-deep disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function NetramTextField({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="label-caps mb-1.5 block">{label}</span>}
      <input
        {...props}
        className={cn(
          "h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10",
          className,
        )}
      />
    </label>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface flex flex-col items-center gap-2 px-6 py-12 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" />
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="surface flex flex-col items-center gap-3 px-6 py-12 text-center">
      <TriangleAlert className="h-6 w-6 text-destructive" />
      <div className="text-sm font-semibold text-foreground">{message}</div>
      {onRetry && <SecondaryButton onClick={onRetry}>Retry</SecondaryButton>}
    </div>
  );
}

export function ComplianceRing({ value, size = 132 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const tone = value >= 85 ? "var(--success)" : value >= 70 ? "var(--accent)" : "var(--destructive)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, Math.max(0, value))) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tracking-tight">{value}%</span>
        <span className="label-caps">Overall</span>
      </div>
    </div>
  );
}

export function AiNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
      <div className="label-caps text-primary">AI-assisted result — requires human review</div>
      <p className="mt-1 text-sm text-foreground">{children}</p>
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="text-sm font-semibold text-primary hover:underline">
      {label}
    </Link>
  );
}
