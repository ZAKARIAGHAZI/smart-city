"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Tooltip,
  useMap,
  Pane,
} from "react-leaflet";
import L from "leaflet";
import {
  trafficRoutes,
  getTrafficColor,
  getTrafficWeight,
  getTrafficLabel,
} from "@/data/routes";
import Controls from "./Controls";
import DashboardBar from "./DashboardBar";
import TemperatureMapLayer from "./TemperatureMapLayer";
import TemperatureSensorsLayer from "./TemperatureSensorsLayer";
import TemperatureStats from "./TemperatureStats";
import TemperatureAlerts from "./TemperatureAlerts";
import TrafficStats from "./TrafficStats";
import GenericPlaceholderStats from "./GenericPlaceholderStats";
import { SMART_CITY_DOMAINS } from "@/data/domains";
import { useTemperatureData } from "@/hooks/useTemperatureData";

import "leaflet/dist/leaflet.css";

/* ── Invalidate map size after mount ── */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

/* ── Routes overlay with zoom-adaptive weight ── */
function RoutesOverlay({ mode }: { mode: "temperature" | "traffic" }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoomend", onZoom);
    return () => { map.off("zoomend", onZoom); };
  }, [map]);

  const scale = Math.pow(1.5, zoom - 13);

  return (
    <>
      {trafficRoutes.map((r) => {
        const baseWeight = getTrafficWeight(r.traffic) * scale;
        // Thin and semi-transparent if temperature mode
        const weight = mode === "temperature" ? 1.5 : Math.max(2, baseWeight);
        const opacity = mode === "temperature" ? 0.3 : 0.9;

        return (
          <Polyline
            key={r.id}
            positions={r.positions}
            pathOptions={{
              color: getTrafficColor(r.traffic),
              weight,
              opacity,
              dashArray: r.traffic === "critical" ? `${10 * scale} ${6 * scale}` : undefined,
            }}
          >
            <Tooltip sticky>
              <strong>{r.fromLabel} → {r.toLabel}</strong>
              <br />Trafic : {getTrafficLabel(r.traffic)}
              <br />Flux : {r.flowPerHour.toLocaleString("fr-FR")} véh/h
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

/* ══════════════════════════════════════════════════ */
export default function Map() {
  const [mode, setMode] = useState<string>("temperature");

  // Get current active domain details
  const activeDomain = useMemo(() => {
    for (const category of SMART_CITY_DOMAINS) {
      const found = category.items.find(item => item.id === mode);
      if (found) return found;
    }
    return SMART_CITY_DOMAINS[0].items[0];
  }, [mode]);

  // Kafka temperature data — the ONLY data source
  const {
    latestReadings,
    districtStats,
    alerts,
    connected,
    loading,
    error,
    acknowledgeAlert,
  } = useTemperatureData();

  const totalSensors = useMemo(() => {
    let count = 0;
    districtStats.forEach((d) => { count += d.sensor_count; });
    return count;
  }, [districtStats]);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Controls Sidebar */}
      <Controls
        mode={mode}
        onModeChange={setMode}
        kafkaConnected={connected}
        districtCount={districtStats.size}
        sensorCount={totalSensors}
      />

      {/* Map Area */}
      <div className="flex-1 relative h-screen">
        <MapContainer
          center={[33.246, -8.506]}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
        >
          <MapResizer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Kafka temperature-colored zones */}
          <TemperatureMapLayer
            districtStats={districtStats}
            visible={mode === "temperature"}
          />

          {/* Traffic routes */}
          <Pane name="routesPane" style={{ zIndex: 450 }}>
            {mode === "traffic" || mode === "traffic_congestion" ? (
              <RoutesOverlay mode={"traffic"} />
            ) : mode === "temperature" ? (
              <RoutesOverlay mode={"temperature"} />
            ) : null}
          </Pane>

          {/* Individual Sensors */}
          <Pane name="sensorsPane" style={{ zIndex: 460 }}>
            <TemperatureSensorsLayer 
              latestReadings={latestReadings} 
              visible={mode === "temperature"} 
            />
          </Pane>
        </MapContainer>

        {/* Dashboard KPI bar — Kafka data only */}
        {mode === "temperature" && (
          <DashboardBar districtStats={districtStats} connected={connected} />
        )}

        {/* Temperature Legend */}
        {mode === "temperature" && (
          <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-md border border-gray-200 rounded-sm p-2 w-max">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              🌡️ Température
            </h3>
            <div className="space-y-1">
              {[
                { color: "#93c5fd", label: "< 15°C" },
                { color: "#60a5fa", label: "15 – 20°C" },
                { color: "#fbbf24", label: "20 – 25°C" },
                { color: "#f59e0b", label: "25 – 29°C" },
                { color: "#f97316", label: "29 – 32°C" },
                { color: "#ef4444", label: "32 – 35°C" },
                { color: "#dc2626", label: "> 35°C" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right panel: Kafka Stats + Alerts */}
      <div className="w-80 h-screen bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto p-3 gap-2">
        {mode === "temperature" ? (
          <>
            <TemperatureStats
              districtStats={districtStats}
              connected={connected}
              loading={loading}
              error={error}
            />
            <TemperatureAlerts
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
            />
          </>
        ) : mode === "traffic" || mode === "traffic_congestion" ? (
          <TrafficStats />
        ) : (
          <GenericPlaceholderStats 
            title={activeDomain.label} 
            icon={activeDomain.icon} 
            colorClass={activeDomain.colorClass} 
          />
        )}
      </div>
    </div>
  );
}
