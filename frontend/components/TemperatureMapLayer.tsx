"use client";

import { useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { DistrictTemperature } from "@/lib/types";
import { getTemperatureFillColor, getTemperatureLevel, getTemperatureLevelLabel } from "@/lib/types";
import { zonesGeoJSON } from "@/data/zones";
import { renderToString } from "react-dom/server";
import { Thermometer, Gauge, Activity } from "lucide-react";

interface TemperatureMapLayerProps {
  districtStats: Map<string, DistrictTemperature>;
  visible: boolean;
}

/**
 * Mapping between zone IDs / names in the GeoJSON and district names
 * returned by the backend. Adjust this mapping if your backend uses
 * different district identifiers than the GeoJSON zone names.
 */
function findDistrictData(
  zoneName: string | undefined | null,
  zoneId: string | undefined | null,
  stats: Map<string, DistrictTemperature>
): DistrictTemperature | undefined {
  if (!zoneName && !zoneId) return undefined;
  if (stats.size === 0) return undefined;

  const name = zoneName ?? "";
  const id = zoneId ?? "";

  // Try exact match first (by name, then by id)
  if (name && stats.has(name)) return stats.get(name);
  if (id && stats.has(id)) return stats.get(id);

  // Try case-insensitive match
  const nameLower = name.toLowerCase();
  const idLower = id.toLowerCase();

  for (const [key, val] of stats) {
    if (!key) continue;
    const keyLower = key.toLowerCase();
    if (
      (nameLower && keyLower === nameLower) ||
      (idLower && keyLower === idLower)
    ) {
      return val;
    }
  }

  return undefined;
}

function buildTemperaturePopup(
  zoneName: string,
  zoneNameAr: string,
  data: DistrictTemperature | undefined
): string {
  const thermIcon = renderToString(<Thermometer size={16} color="#ef4444" strokeWidth={2.5} />);
  const gaugeIcon = renderToString(<Gauge size={16} color="#f59e0b" strokeWidth={2.5} />);
  const activityIcon = renderToString(<Activity size={16} color="#8b5cf6" strokeWidth={2.5} />);

  if (!data) {
    return `
      <div style="min-width:180px;font-family:Inter,system-ui,sans-serif">
        <h3 style="margin:0 0 2px;font-size:15px;font-weight:800;color:#0f172a">${zoneName}</h3>
        <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;direction:rtl">${zoneNameAr}</p>
        <p style="font-size:12px;color:#94a3b8;text-align:center;padding:12px 0">
          Aucune donnée de capteur Kafka
        </p>
      </div>`;
  }

  const level = getTemperatureLevel(data.avg_temperature);
  const levelLabel = getTemperatureLevelLabel(level);
  const levelColor =
    level === "critical" ? "#ef4444" : level === "warm" ? "#f59e0b" : "#3b82f6";

  const lastUpdate = new Date(data.last_update).toLocaleTimeString("fr-FR");

  const row = (iconSvg: string, label: string, val: string, unit: string) =>
    `<div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:#f8fafc;border-radius:6px;margin-bottom:4px">
      <span style="display:flex;align-items:center;width:16px">${iconSvg}</span>
      <span style="font-size:11px;color:#64748b;min-width:48px">${label}</span>
      <span style="font-weight:700;font-size:13px;color:#0f172a">${val}</span>
      <span style="font-size:10px;color:#94a3b8">${unit}</span>
    </div>`;

  return `
    <div style="min-width:220px;font-family:Inter,system-ui,sans-serif">
      <h3 style="margin:0 0 2px;font-size:15px;font-weight:800;color:#0f172a">${zoneName}</h3>
      <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;direction:rtl">${zoneNameAr}</p>
      <div style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-bottom:8px;background:${levelColor}20;color:${levelColor}">
        ${levelLabel}
      </div>
      <div style="margin-bottom:6px">
        ${row(thermIcon, "Moy.", data.avg_temperature.toFixed(1) + "°C", "")}
        ${row(thermIcon, "Min", data.min_temperature.toFixed(1) + "°C", "")}
        ${row(thermIcon, "Max", data.max_temperature.toFixed(1) + "°C", "")}
        ${row(activityIcon, "Capteurs", data.sensor_count.toString(), "actifs")}
      </div>
      <div style="font-size:10px;color:#94a3b8;text-align:right;margin-top:4px">
        Dernière MAJ: ${lastUpdate}
      </div>
    </div>`;
}

export default function TemperatureMapLayer({
  districtStats,
  visible,
}: TemperatureMapLayerProps) {
  if (!visible) return null;

  const styleFn = (feature: any) => {
    if (!feature?.properties) return {};
    const data = findDistrictData(
      feature.properties.name,
      feature.properties.id,
      districtStats
    );
    const temp = data?.avg_temperature ?? 22;
    return {
      fillColor: getTemperatureFillColor(temp),
      weight: 2,
      opacity: 0.9,
      color: "#ffffff",
      fillOpacity: data ? 0.7 : 0.2,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const data = findDistrictData(props.name, props.id, districtStats);

    layer.bindPopup(
      buildTemperaturePopup(props.name, props.nameAr, data),
      { maxWidth: 300, className: "smart-popup" }
    );

    const temp = data?.avg_temperature;
    const tempStr = temp !== undefined ? `${temp.toFixed(1)}°C` : "—";

    (layer as L.Path).bindTooltip(
      `<strong>${props.name}</strong><br/>🌡️ ${tempStr}`,
      { sticky: true, className: "smart-tooltip" }
    );

    (layer as L.Path).on({
      mouseover: (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).setStyle({
          weight: 3,
          color: "#1e293b",
          fillOpacity: 0.85,
        });
        (e.target as L.Path).bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).setStyle(styleFn(feature));
      },
    });
  };

  return (
    <GeoJSON
      key={`temp-${JSON.stringify(Array.from(districtStats.entries()))}`}
      data={zonesGeoJSON as GeoJSON.FeatureCollection}
      style={styleFn}
      onEachFeature={onEachFeature}
    />
  );
}
