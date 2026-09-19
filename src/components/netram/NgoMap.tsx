import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { markerColor } from "@/lib/netram";

export type MapNgo = {
  id: string;
  name: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  compliance: number;
  risk_level: string;
  cctv_status: string;
  last_inspection: string | null;
};

function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 6px rgba(16,24,40,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function NgoMap({
  ngos,
  onSelect,
  officerPosition,
}: {
  ngos: MapNgo[];
  onSelect?: (ngo: MapNgo) => void;
  officerPosition?: { lat: number; lng: number } | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true }).setView([23.5, 80], 4.6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    ngos.forEach((ngo) => {
      const marker = L.marker([ngo.latitude, ngo.longitude], {
        icon: pinIcon(markerColor(ngo.risk_level, ngo.compliance)),
      }).addTo(layer);
      marker.bindTooltip(`${ngo.name} — ${ngo.compliance}%`, { direction: "top" });
      marker.on("click", () => onSelect?.(ngo));
    });
    if (officerPosition) {
      L.marker([officerPosition.lat, officerPosition.lng], { icon: pinIcon("#1557E8") })
        .addTo(layer)
        .bindTooltip("Your current location", { direction: "top" });
    }
    if (ngos.length > 0) {
      const bounds = L.latLngBounds(ngos.map((n) => [n.latitude, n.longitude] as [number, number]));
      if (officerPosition) bounds.extend([officerPosition.lat, officerPosition.lng]);
      map.fitBounds(bounds.pad(0.25));
    }
  }, [ngos, officerPosition, onSelect]);

  return <div ref={containerRef} className="h-full w-full" />;
}
