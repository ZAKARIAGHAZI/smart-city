"use client";

import type { DistrictTemperature } from "@/lib/types";
import { getTemperatureLevel, getTemperatureLevelColor } from "@/lib/types";
import { Thermometer, Activity, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardBarProps {
  districtStats: Map<string, DistrictTemperature>;
  connected: boolean;
}

export default function DashboardBar({ districtStats, connected }: DashboardBarProps) {
  const districts = Array.from(districtStats.values());

  const avgTemp = districts.length > 0
    ? districts.reduce((s, d) => s + d.avg_temperature, 0) / districts.length
    : 0;
  const globalMin = districts.length > 0
    ? Math.min(...districts.map((d) => d.min_temperature))
    : 0;
  const globalMax = districts.length > 0
    ? Math.max(...districts.map((d) => d.max_temperature))
    : 0;
  const totalSensors = districts.reduce((s, d) => s + d.sensor_count, 0);
  const criticalZones = districts.filter((d) => d.avg_temperature >= 32).length;
  const warmZones = districts.filter((d) => d.avg_temperature >= 25 && d.avg_temperature < 32).length;

  const kpis = [
    {
      icon: <Thermometer className="w-4 h-4 text-white" />,
      label: "Temp. moyenne",
      value: districts.length > 0 ? `${avgTemp.toFixed(1)}` : "—",
      unit: "°C",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: <TrendingDown className="w-4 h-4 text-white" />,
      label: "Temp. min",
      value: districts.length > 0 ? `${globalMin.toFixed(1)}` : "—",
      unit: "°C",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      label: "Temp. max",
      value: districts.length > 0 ? `${globalMax.toFixed(1)}` : "—",
      unit: "°C",
      color: "from-red-400 to-red-600",
    },
    {
      icon: <Activity className="w-4 h-4 text-white" />,
      label: "Capteurs actifs",
      value: totalSensors.toString(),
      unit: "en ligne",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: <AlertTriangle className="w-4 h-4 text-white" />,
      label: "Zones critiques",
      value: criticalZones.toString(),
      unit: `/ ${districts.length}`,
      color: criticalZones > 0 ? "from-red-500 to-red-700" : "from-green-400 to-green-600",
    },
  ];

  return (
    <div className="absolute top-2 left-4 right-4 z-[1000] flex gap-2 pointer-events-none">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-sm px-3 py-2.5 pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-sm bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-medium truncate">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-gray-800 leading-tight">{kpi.value}</span>
                <span className="text-[10px] text-gray-400 font-medium">{kpi.unit}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {connected && (
        <div className="flex items-center gap-2 bg-green-50/95 backdrop-blur-md border border-green-200 rounded-sm px-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-600 whitespace-nowrap">KAFKA LIVE</span>
        </div>
      )}
    </div>
  );
}
