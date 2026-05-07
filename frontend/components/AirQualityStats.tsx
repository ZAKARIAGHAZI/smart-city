"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Wind,
  AlertTriangle,
  Wifi,
  WifiOff,
  TrendingUp,
} from "lucide-react";
import type { DistrictTemperature } from "@/lib/types";
import TrendChart from "./TrendChart";

interface AirQualityStatsProps {
  districtStats: Map<string, DistrictTemperature>;
  history: { time: string; aqi: number }[];
  connected: boolean;
  loading: boolean;
  error: string | null;
}

const getAqiLabel = (aqi: number) => {
  if (aqi <= 50) return { label: "Bon", color: "#22c55e" };
  if (aqi <= 100) return { label: "Moyen", color: "#eab308" };
  if (aqi <= 150) return { label: "Sensible", color: "#f97316" };
  if (aqi <= 200) return { label: "Mauvais", color: "#ef4444" };
  return { label: "Critique", color: "#7f1d1d" };
};

export default function AirQualityStats({
  districtStats,
  history: initialHistory,
  connected,
  loading,
  error,
}: AirQualityStatsProps) {
  const districts = Array.from(districtStats.values());

  const avgAqi =
    districts.length > 0
      ? districts.reduce((s, d) => s + (d.avg_aqi || 0), 0) / districts.length
      : 0;

  const combinedHistory = useMemo(() => {
    // 1. 23 fixed historical points
    const fixedHistory = initialHistory
      .slice(0, 23)
      .map(h => {
        const date = new Date(h.time);
        const hours = date.getHours().toString().padStart(2, '0');
        return {
          time: `${hours}:00`,
          value: h.aqi,
          isLive: false
        };
      });

    // 2. 1 dynamic live point
    const livePoint = {
      time: "Direct",
      value: avgAqi || (initialHistory.length > 23 ? initialHistory[23].aqi : 0),
      isLive: true
    };

    return [...fixedHistory, livePoint];
  }, [initialHistory, avgAqi]);

  const badAqiCount = districts.filter((d) => (d.avg_aqi || 0) > 100).length;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border border-gray-200 rounded-sm p-4 bg-white/50 backdrop-blur-sm shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Analyse Qualité Air
        </h3>
        <TrendChart 
          data={combinedHistory} 
          color="#10b981" 
          label="AQI" 
          unit="" 
        />
      </div>

      <div className=" border border-gray-200 rounded-sm p-4 bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Indices par Quartier
          </h3>
          <div className="flex items-center gap-1.5">
            {connected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {loading && (
          <div className="text-xs text-gray-500 text-center py-4">
            Analyse de l'air en cours...
          </div>
        )}

        {!loading && !error && districts.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 p-3 rounded-2xl text-center border border-emerald-100">
                <span className="block text-[10px] uppercase font-bold text-emerald-600 mb-1">
                  Moyenne Ville
                </span>
                <span className="text-2xl font-black text-emerald-800">
                  {Math.round(avgAqi)}
                </span>
              </div>
              <div
                className={`${badAqiCount > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"} p-3 rounded-2xl text-center border`}
              >
                <span className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Zones Risque
                </span>
                <span
                  className={`text-2xl font-black ${badAqiCount > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {badAqiCount}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {districts
                .sort((a, b) => a.district.localeCompare(b.district))
                .map((d) => {
                  const aqi = d.avg_aqi || 0;
                  const { label, color } = getAqiLabel(aqi);
                  return (
                    <div
                      key={d.district}
                      className="flex items-center justify-between px-4 py-3 bg-white/80 rounded-full border border-gray-100 transition-all hover:shadow-md"
                    >
                      <span className="text-sm font-semibold text-gray-700 truncate">
                        {d.district}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-gray-900">
                          {Math.round(aqi)}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{
                            backgroundColor: color + "15",
                            color: color,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
