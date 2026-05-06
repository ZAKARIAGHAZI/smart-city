"use client";

import { useEffect, useState } from "react";
import { Thermometer, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import type { DistrictTemperature } from "@/lib/types";
import {
  getTemperatureLevel,
  getTemperatureLevelColor,
  getTemperatureLevelLabel,
} from "@/lib/types";

interface TemperatureStatsProps {
  districtStats: Map<string, DistrictTemperature>;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export default function TemperatureStats({
  districtStats,
  connected,
  loading,
  error,
}: TemperatureStatsProps) {
  const districts = Array.from(districtStats.values());

  // City-wide aggregates
  const avgTemp =
    districts.length > 0
      ? districts.reduce((s, d) => s + d.avg_temperature, 0) / districts.length
      : 0;
  const globalMin =
    districts.length > 0
      ? Math.min(...districts.map((d) => d.min_temperature))
      : 0;
  const globalMax =
    districts.length > 0
      ? Math.max(...districts.map((d) => d.max_temperature))
      : 0;
  const totalSensors = districts.reduce((s, d) => s + d.sensor_count, 0);
  const criticalZones = districts.filter((d) => d.avg_temperature >= 32).length;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-2 ">
      {/* Connection status */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          Températures
        </h3>
        <div className="flex items-center gap-1.5">
          {connected ? (
            <Wifi className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-400" />
          )}
          <span className={`text-[10px] font-semibold ${connected ? "text-green-600" : "text-red-400"}`}>
            {connected ? "CONNECTÉ" : "HORS LIGNE"}
          </span>
        </div>
      </div>

      {loading && (
        <div className="text-xs text-gray-400 text-center py-2">
          Chargement des données capteurs…
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 bg-red-50 rounded-sm p-2 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {!loading && !error && districts.length > 0 && (
        <>
          {/* City-wide KPIs */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-sm p-2 text-center">
              <p className="text-[10px] text-gray-400">Moyenne</p>
              <p className="text-lg font-extrabold text-gray-800">
                {avgTemp.toFixed(1)}°
              </p>
            </div>
            <div className="bg-blue-50 rounded-sm p-2 text-center">
              <p className="text-[10px] text-blue-400">Min</p>
              <p className="text-lg font-extrabold text-blue-600">
                {globalMin.toFixed(1)}°
              </p>
            </div>
            <div className="bg-red-50 rounded-sm p-2 text-center">
              <p className="text-[10px] text-red-400">Max</p>
              <p className="text-lg font-extrabold text-red-600">
                {globalMax.toFixed(1)}°
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
            <span>{totalSensors} capteurs actifs</span>
            {criticalZones > 0 && (
              <span className="text-red-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {criticalZones} zone{criticalZones > 1 ? "s" : ""} critique{criticalZones > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Per-district list */}
          <div className="space-y-1.5">
            {districts
              .sort((a, b) => b.avg_temperature - a.avg_temperature)
              .map((d) => {
                const level = getTemperatureLevel(d.avg_temperature);
                return (
                  <div
                    key={d.district}
                    className="flex items-center justify-between px-2.5 py-2 bg-gray-50 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getTemperatureLevelColor(level) }}
                      />
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                        {d.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">
                        {d.avg_temperature.toFixed(1)}°C
                      </span>
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: getTemperatureLevelColor(level) + "20",
                          color: getTemperatureLevelColor(level),
                        }}
                      >
                        {getTemperatureLevelLabel(level)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {!loading && !error && districts.length === 0 && (
        <div className="text-xs text-gray-400 text-center py-2">
          Aucune donnée de température reçue.
          <br />En attente des capteurs Kafka…
        </div>
      )}
    </div>
  );
}
