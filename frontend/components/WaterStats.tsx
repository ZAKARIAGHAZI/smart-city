"use client";

import { useEffect, useState, useMemo } from "react";
import { Droplets, Wifi, WifiOff, TrendingUp, Activity } from "lucide-react";
import type { DistrictWater } from "@/lib/types";
import { getPhColor } from "@/lib/types";
import TrendChart from "./TrendChart";

interface WaterStatsProps {
  districtStats: Map<string, DistrictWater>;
  history: { time: string; flow: number }[];
  connected: boolean;
  loading: boolean;
}

export default function WaterStats({
  districtStats,
  history: initialHistory,
  connected,
  loading,
}: WaterStatsProps) {
  const districts = Array.from(districtStats.values());

  const totalVolume = districts.reduce((s, d) => s + d.total_volume, 0);
  const avgFlow =
    districts.length > 0
      ? districts.reduce((s, d) => s + d.avg_flow, 0) / districts.length
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
          value: h.flow,
          isLive: false
        };
      });

    // 2. 1 dynamic live point
    const livePoint = {
      time: "Direct",
      value: avgFlow || (initialHistory.length > 23 ? initialHistory[23].flow : 0),
      isLive: true
    };

    return [...fixedHistory, livePoint];
  }, [initialHistory, avgFlow]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border border-gray-200 rounded-sm p-4 bg-white/50 backdrop-blur-sm shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Analyse Débit Eau
        </h3>
        <TrendChart 
          data={combinedHistory} 
          color="#3b82f6" 
          label="Débit" 
          unit=" L/m" 
        />
      </div>

      <div className=" border border-gray-200 rounded-sm p-4 bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Gestion par Quartier
          </h3>
          <div className="flex items-center gap-1.5">
            {connected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {!loading && districts.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
                <span className="block text-[10px] uppercase font-bold text-blue-600 mb-1">
                  Volume Total
                </span>
                <span className="text-xl font-black text-blue-800">
                  {totalVolume.toFixed(1)} L
                </span>
              </div>
              <div className="bg-cyan-50 p-3 rounded-2xl text-center border border-cyan-100">
                <span className="block text-[10px] uppercase font-bold text-cyan-600 mb-1">
                  Débit Moyen
                </span>
                <span className="text-xl font-black text-cyan-800">
                  {avgFlow.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {districts
                .sort((a, b) => a.district.localeCompare(b.district))
                .map((d) => {
                  const phColor = getPhColor(d.avg_ph);
                  return (
                    <div
                      key={d.district}
                      className="flex flex-col gap-2 p-3 bg-white/80 rounded-2xl border border-gray-100 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700">
                          {d.district}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                          <Activity className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {d.sensor_count} Sensors
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                            style={{ backgroundColor: phColor }}
                          />
                          <span className="text-xs font-semibold text-gray-500">
                            pH {d.avg_ph.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-base font-black text-blue-600">
                          {d.avg_flow.toFixed(2)} <span className="text-[10px]">L/min</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {loading && (
          <div className="text-center py-6 text-xs text-gray-400 animate-pulse">
            Analyse des flux d'eau...
          </div>
        )}
      </div>
    </div>
  );
}
