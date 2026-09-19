import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

import { LoadingState } from "./ui";
import type { MapNgo } from "./NgoMap";

const NgoMap = lazy(() => import("./NgoMap"));

export function MapPanel(props: {
  ngos: MapNgo[];
  onSelect?: (ngo: MapNgo) => void;
  officerPosition?: { lat: number; lng: number } | null;
  selectedId?: string;
  className?: string;
}) {
  const { className, ...rest } = props;
  return (
    <div className={className ?? "h-[460px] w-full overflow-hidden rounded-xl border border-border bg-card"}>
      <ClientOnly fallback={<LoadingState label="Loading map" />}>
        <Suspense fallback={<LoadingState label="Loading map" />}>
          <NgoMap {...rest} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}

export function MapLegend() {
  const items = [
    { color: "#16A34A", label: "Low risk" },
    { color: "#1557E8", label: "Normal" },
    { color: "#FF7A00", label: "Warning" },
    { color: "#DC2626", label: "High risk" },
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: i.color }} />
          {i.label}
        </div>
      ))}
    </div>
  );
}

export type { MapNgo };
