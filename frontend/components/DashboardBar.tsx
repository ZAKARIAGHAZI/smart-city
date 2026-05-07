"use client";

import React from "react";
import type { DistrictTemperature, DistrictWater } from "@/lib/types";
import {
  getTemperatureLevel,
  getTemperatureLevelColor,
  getAqiLevel,
  getAqiLevelColor,
  getPhLevel,
  getPhLevelColor,
  getWaterFlowLevel,
  getWaterFlowLevelColor,
} from "@/lib/types";
import {
  Thermometer,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wind,
  Droplets,
  FlaskConical,
  Car,
  Navigation,
  Gauge,
} from "lucide-react";
import type { TrafficRoute } from "@/data/routes";

interface DashboardBarProps {
  mode: string;
  districtStats?: Map<string, DistrictTemperature>;
  waterStats?: Map<string, DistrictWater>;
  trafficRoutes?: TrafficRoute[];
  connected: boolean;
}

export default function DashboardBar({
  mode,
  districtStats,
  waterStats,
  trafficRoutes,
  connected,
}: DashboardBarProps) {
  const getDomainStats = () => {
    switch (mode) {
      case "temperature": {
        const districts = Array.from(districtStats?.values() || []);
        if (districts.length === 0) return null;
        const avg =
          districts.reduce((s, d) => s + d.avg_temperature, 0) /
          districts.length;
        const min = Math.min(...districts.map((d) => d.min_temperature));
        const max = Math.max(...districts.map((d) => d.max_temperature));
        const total = districts.reduce((s, d) => s + d.sensor_count, 0);
        const critical = districts.filter(
          (d) => getTemperatureLevel(d.avg_temperature) >= 2,
        ).length;

        return {
          title: "Température",
          kpis: [
            {
              icon: <Thermometer />,
              label: "Moyenne",
              value: avg.toFixed(1),
              unit: "°C",
              color: "from-orange-400 to-red-500",
            },
            {
              icon: <TrendingDown />,
              label: "Minimum",
              value: min.toFixed(1),
              unit: "°C",
              color: "from-blue-400 to-blue-600",
            },
            {
              icon: <TrendingUp />,
              label: "Maximum",
              value: max.toFixed(1),
              unit: "°C",
              color: "from-red-400 to-red-600",
            },
            {
              icon: <Activity />,
              label: "Capteurs",
              value: total.toString(),
              unit: "actifs",
              color: "from-violet-400 to-purple-500",
            },
            {
              icon: <AlertTriangle />,
              label: "Alertes",
              value: critical.toString(),
              unit: "zones",
              color:
                critical > 0
                  ? "from-red-500 to-red-700"
                  : "from-green-400 to-green-600",
            },
          ],
          distribution: {
            levels: [0, 1, 2],
            getColor: getTemperatureLevelColor,
            getWeight: (level: number) =>
              districts.filter(
                (d) => getTemperatureLevel(d.avg_temperature) === level,
              ).length,
          },
        };
      }
      case "air_quality": {
        const districts = Array.from(districtStats?.values() || []);
        if (districts.length === 0) return null;
        const avg =
          districts.reduce((s, d) => s + (d.avg_aqi || 0), 0) /
          districts.length;
        const max = Math.max(...districts.map((d) => d.avg_aqi || 0));
        const total = districts.reduce((s, d) => s + d.sensor_count, 0);
        const critical = districts.filter((d) => (d.avg_aqi || 0) > 150).length;

        return {
          title: "Qualité de l'Air",
          kpis: [
            {
              icon: <Wind />,
              label: "AQI Moyen",
              value: avg.toFixed(0),
              unit: "",
              color: "from-green-400 to-emerald-600",
            },
            {
              icon: <AlertTriangle />,
              label: "AQI Max",
              value: max.toFixed(0),
              unit: "",
              color: "from-orange-400 to-red-600",
            },
            {
              icon: <Activity />,
              label: "Capteurs",
              value: total.toString(),
              unit: "actifs",
              color: "from-blue-400 to-cyan-500",
            },
            {
              icon: <Navigation />,
              label: "Zones Critiques",
              value: critical.toString(),
              unit: "alertes",
              color:
                critical > 0
                  ? "from-red-500 to-red-700"
                  : "from-green-400 to-green-600",
            },
          ],
          distribution: {
            levels: [0, 1, 2, 3, 4, 5],
            getColor: getAqiLevelColor,
            getWeight: (level: number) =>
              districts.filter((d) => getAqiLevel(d.avg_aqi || 0) === level)
                .length,
          },
        };
      }
      case "water_consumption": {
        const districts = Array.from(waterStats?.values() || []);
        if (districts.length === 0) return null;
        const totalFlow = districts.reduce((s, d) => s + d.avg_flow, 0);
        const totalVolume = districts.reduce((s, d) => s + d.total_volume, 0);
        const avg = totalFlow / districts.length;
        const sensors = districts.reduce((s, d) => s + d.sensor_count, 0);

        return {
          title: "Consommation d'Eau",
          kpis: [
            {
              icon: <Droplets />,
              label: "Débit Total",
              value: totalFlow.toFixed(1),
              unit: "L/min",
              color: "from-blue-400 to-indigo-600",
            },
            {
              icon: <Gauge />,
              label: "Moyenne",
              value: avg.toFixed(1),
              unit: "L/min",
              color: "from-cyan-400 to-blue-500",
            },
            {
              icon: <Activity />,
              label: "Volume Cumulé",
              value: totalVolume.toFixed(0),
              unit: "L",
              color: "from-blue-500 to-blue-700",
            },
            {
              icon: <Navigation />,
              label: "Points d'accès",
              value: sensors.toString(),
              unit: "actifs",
              color: "from-teal-400 to-emerald-500",
            },
          ],
          distribution: {
            levels: [0, 1, 2, 3],
            getColor: getWaterFlowLevelColor,
            getWeight: (level: number) =>
              districts.filter((d) => getWaterFlowLevel(d.avg_flow) === level)
                .length,
          },
        };
      }
      case "water_quality": {
        const districts = Array.from(waterStats?.values() || []);
        if (districts.length === 0) return null;
        const avgPh =
          districts.reduce((s, d) => s + d.avg_ph, 0) / districts.length;
        const avgTurb =
          districts.reduce((s, d) => s + d.avg_turbidity, 0) / districts.length;
        const alerts = districts.filter(
          (d) => d.avg_ph < 6.5 || d.avg_ph > 8.5,
        ).length;

        return {
          title: "Qualité de l'Eau",
          kpis: [
            {
              icon: <FlaskConical />,
              label: "pH Moyen",
              value: avgPh.toFixed(1),
              unit: "pH",
              color: "from-teal-400 to-green-600",
            },
            {
              icon: <Droplets />,
              label: "Turbidité",
              value: avgTurb.toFixed(2),
              unit: "NTU",
              color: "from-amber-400 to-orange-500",
            },
            {
              icon: <AlertTriangle />,
              label: "Hors Normes",
              value: alerts.toString(),
              unit: "zones",
              color:
                alerts > 0
                  ? "from-red-500 to-red-700"
                  : "from-green-400 to-green-600",
            },
          ],
          distribution: {
            levels: [0, 1, 2],
            getColor: getPhLevelColor,
            getWeight: (level: number) =>
              districts.filter((d) => getPhLevel(d.avg_ph) === level).length,
          },
        };
      }
      case "traffic_flow":
      case "traffic_incidents": {
        const routes = trafficRoutes || [];
        if (routes.length === 0) return null;
        const avgFlow =
          routes.reduce((s, r) => s + r.flowPerHour, 0) / routes.length;
        const totalFlow = routes.reduce((s, r) => s + r.flowPerHour, 0);
        const critical = routes.filter((r) => r.traffic === "critical").length;
        const high = routes.filter((r) => r.traffic === "high").length;

        return {
          title: "Trafic Routier",
          kpis: [
            {
              icon: <Car />,
              label: "Flux Moyen",
              value: avgFlow.toFixed(0),
              unit: "véh/h",
              color: "from-blue-400 to-blue-600",
            },
            {
              icon: <Navigation />,
              label: "Volume Total",
              value: totalFlow.toLocaleString(),
              unit: "véh",
              color: "from-slate-500 to-slate-700",
            },
            {
              icon: <AlertTriangle />,
              label: "Points Noirs",
              value: critical.toString(),
              unit: "critiques",
              color:
                critical > 0
                  ? "from-red-600 to-red-800"
                  : "from-green-500 to-green-700",
            },
            {
              icon: <TrendingUp />,
              label: "Congestion",
              value: (high + critical).toString(),
              unit: "segments",
              color: "from-orange-500 to-red-600",
            },
          ],
          distribution: {
            levels: ["low", "medium", "high", "critical"],
            getColor: (l: string) => {
              const colors: any = {
                low: "#22c55e",
                medium: "#f59e0b",
                high: "#ef4444",
                critical: "#dc2626",
              };
              return colors[l];
            },
            getWeight: (level: string) =>
              routes.filter((r) => r.traffic === level).length,
          },
        };
      }
      default:
        return null;
    }
  };

  const stats = getDomainStats();
  if (!stats) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col items-center gap-4 pointer-events-none">
      {/* KPI Row */}
      <div className="w-full flex items-stretch justify-around gap-4">
        {stats.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="flex-1 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-4 pointer-events-auto transition-all hover:bg-white/90"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white [&>svg]:w-7 [&>svg]:h-7`}
              >
                {kpi.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 tabular-nums">
                    {kpi.value}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    {kpi.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Statistics Bar */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 pointer-events-auto flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-700">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest whitespace-nowrap">
            Analyse {stats.title}
          </span>
        </div>

        <div className="flex-1 h-3 flex rounded-full overflow-hidden bg-gray-100">
          {stats.distribution.levels.map((level) => {
            const count = stats.distribution.getWeight(level as never);
            const total = mode.startsWith("traffic")
              ? trafficRoutes?.length || 1
              : mode.startsWith("water")
                ? waterStats?.size || 1
                : districtStats?.size || 1;
            if (count === 0) return null;
            const width = (count / total) * 100;
            return (
              <div
                key={level.toString()}
                style={{
                  width: `${width}%`,
                  backgroundColor: stats.distribution.getColor(level as never),
                }}
                className="h-full transition-all duration-500"
              />
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {connected && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-black text-red-600 tracking-tighter uppercase">
                {mode === "traffic_flow" ? "TEMPS RÉEL" : "LIVE FEED"}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-500 tabular-nums">
            {new Date().toLocaleTimeString("fr-FR")}
          </span>
        </div>
      </div>
    </div>
  );
}
