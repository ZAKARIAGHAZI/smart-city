"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import type { WaterReading, DistrictWater } from "@/lib/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.22:4000";

export function useWaterData() {
  const [latestReadings, setLatestReadings] = useState<WaterReading[]>([]);
  const [districtStats, setDistrictStats] = useState<Map<string, DistrictWater>>(new Map());
  const [history, setHistory] = useState<{ time: string; flow: number }[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [latestRes, statsRes, historyRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/water/latest`),
        fetch(`${BACKEND_URL}/api/water/stats-by-district`),
        fetch(`${BACKEND_URL}/api/water/history`),
      ]);

      if (!latestRes.ok || !statsRes.ok || !historyRes.ok) throw new Error("Fetch error");

      const rawData: WaterReading[] = await latestRes.json();
      const historyData = await historyRes.json();
      setHistory(historyData);
      
      const latestMap = new Map<string, WaterReading>();
      rawData.forEach(r => {
        const existing = latestMap.get(r.sensor_id);
        if (!existing || new Date(r.timestamp) > new Date(existing.timestamp)) {
          latestMap.set(r.sensor_id, r);
        }
      });
      const latest = Array.from(latestMap.values());
      setLatestReadings(latest);

      const statsMap = new Map<string, DistrictWater>();
      latest.forEach(r => {
        if (!r.district) return;
        const existing = statsMap.get(r.district);
        const flow = r.water_flow?.flow_rate_l_min || 0;
        const vol = r.water_flow?.volume_l || 0;
        const ph = r.water_quality?.ph || 7;

        if (existing) {
          const count = existing.sensor_count + 1;
          statsMap.set(r.district, {
            ...existing,
            avg_flow: (existing.avg_flow * existing.sensor_count + flow) / count,
            total_volume: existing.total_volume + vol,
            avg_ph: (existing.avg_ph * existing.sensor_count + ph) / count,
            sensor_count: count,
          });
        } else {
          statsMap.set(r.district, {
            district: r.district,
            avg_flow: flow,
            total_volume: vol,
            avg_ph: ph,
            avg_turbidity: r.water_quality?.turbidity_ntu || 0,
            sensor_count: 1,
            last_update: r.timestamp,
          });
        }
      });
      setDistrictStats(statsMap);
    } catch (err) {
      console.error("[useWaterData] Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    const socket = getSocket();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("water:new", (payload: WaterReading | WaterReading[]) => {
      const readings = Array.isArray(payload) ? payload : [payload];
      setLatestReadings(prev => {
        const updated = [...prev];
        readings.forEach(r => {
          const idx = updated.findIndex(existing => existing.sensor_id === r.sensor_id);
          if (idx >= 0) updated[idx] = r;
          else updated.unshift(r);
        });

        const statsMap = new Map<string, DistrictWater>();
        updated.forEach(r => {
          if (!r.district) return;
          const existing = statsMap.get(r.district);
          const flow = r.water_flow?.flow_rate_l_min || 0;
          const vol = r.water_flow?.volume_l || 0;
          const ph = r.water_quality?.ph || 7;

          if (existing) {
            const count = existing.sensor_count + 1;
            statsMap.set(r.district, {
              ...existing,
              avg_flow: (existing.avg_flow * existing.sensor_count + flow) / count,
              total_volume: existing.total_volume + vol,
              avg_ph: (existing.avg_ph * existing.sensor_count + ph) / count,
              sensor_count: count,
              last_update: r.timestamp > existing.last_update ? r.timestamp : existing.last_update,
            });
          } else {
            statsMap.set(r.district, {
              district: r.district,
              avg_flow: flow,
              total_volume: vol,
              avg_ph: ph,
              avg_turbidity: r.water_quality?.turbidity_ntu || 0,
              sensor_count: 1,
              last_update: r.timestamp,
            });
          }
        });
        setDistrictStats(statsMap);
        return updated;
      });
    });

    return () => {
      socket.off("water:new");
    };
  }, [fetchInitialData]);

  return { latestReadings, districtStats, history, connected, loading };
}
