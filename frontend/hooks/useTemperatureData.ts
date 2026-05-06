"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import type {
  TemperatureReading,
  DistrictTemperature,
  TemperatureAlert,
} from "@/lib/types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.22:4000";

export interface UseTemperatureDataReturn {
  /** Latest readings per sensor */
  latestReadings: TemperatureReading[];
  /** Aggregated stats per district */
  districtStats: Map<string, DistrictTemperature>;
  /** Alerts (temp >= 35°C) */
  alerts: TemperatureAlert[];
  /** Whether the Socket.IO connection is live */
  connected: boolean;
  /** Loading state for initial fetch */
  loading: boolean;
  /** Any error message */
  error: string | null;
  /** Dismiss an alert */
  acknowledgeAlert: (id: string) => void;
}

/**
 * Custom hook: fetches initial temperature data from REST API,
 * then subscribes to Socket.IO for real-time updates from Kafka.
 */
export function useTemperatureData(): UseTemperatureDataReturn {
  const [latestReadings, setLatestReadings] = useState<TemperatureReading[]>([]);
  const [districtStats, setDistrictStats] = useState<Map<string, DistrictTemperature>>(new Map());
  const [alerts, setAlerts] = useState<TemperatureAlert[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alertIdCounter = useRef(0);

  // ── Fetch initial data from REST API ──
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [latestRes, avgRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/temperatures/latest`),
        fetch(`${BACKEND_URL}/api/temperatures/avg-by-district`),
      ]);

      if (!latestRes.ok || !avgRes.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const latestData: TemperatureReading[] = await latestRes.json();
      const avgData: DistrictTemperature[] = await avgRes.json();

      setLatestReadings(latestData);

      const statsMap = new Map<string, DistrictTemperature>();
      avgData.forEach((d) => {
        if (d.district) statsMap.set(d.district, d);
      });
      setDistrictStats(statsMap);

      // Generate alerts from initial data
      const initialAlerts: TemperatureAlert[] = latestData
        .filter((r) => r.temperature >= 35)
        .map((r) => ({
          id: `initial-${alertIdCounter.current++}`,
          sensor_id: r.sensor_id,
          district: r.district,
          temperature: r.temperature,
          timestamp: r.timestamp,
          acknowledged: false,
        }));
      setAlerts(initialAlerts);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      console.error("[useTemperatureData] Fetch error:", msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Subscribe to Socket.IO events ──
  useEffect(() => {
    fetchInitialData();

    const socket = getSocket();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // New temperature reading(s) from Kafka → backend → here
    socket.on("temperature:new", (payload: TemperatureReading | TemperatureReading[]) => {
      const readings = Array.isArray(payload) ? payload : [payload];
      const validReadings = readings.filter(r => r && r.district);
      
      if (validReadings.length === 0) return;

      // Update latest readings list
      setLatestReadings((prev) => {
        const updated = [...prev];
        validReadings.forEach(reading => {
          const idx = updated.findIndex((r) => r.sensor_id === reading.sensor_id);
          if (idx >= 0) {
            updated[idx] = reading;
          } else {
            updated.unshift(reading);
          }
        });
        return updated;
      });

      // Update district stats (recalculate on the fly)
      setDistrictStats((prev) => {
        const next = new Map(prev);
        
        validReadings.forEach(reading => {
          const existing = next.get(reading.district);
          if (existing) {
            next.set(reading.district, {
              ...existing,
              avg_temperature:
                (existing.avg_temperature * existing.sensor_count + reading.temperature) /
                (existing.sensor_count + 1),
              min_temperature: Math.min(existing.min_temperature, reading.temperature),
              max_temperature: Math.max(existing.max_temperature, reading.temperature),
              last_update: reading.timestamp,
            });
          } else {
            next.set(reading.district, {
              district: reading.district,
              avg_temperature: reading.temperature,
              min_temperature: reading.temperature,
              max_temperature: reading.temperature,
              sensor_count: 1,
              last_update: reading.timestamp,
            });
          }
        });
        
        return next;
      });

      // Check for alert thresholds
      const newAlerts: TemperatureAlert[] = [];
      validReadings.forEach(reading => {
        if (reading.temperature >= 35) {
          newAlerts.push({
            id: `rt-${alertIdCounter.current++}`,
            sensor_id: reading.sensor_id,
            district: reading.district,
            temperature: reading.temperature,
            timestamp: reading.timestamp,
            acknowledged: false,
          });
        }
      });
      
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 100));
      }
    });

    // Backend-generated alert event
    socket.on("temperature:alert", (alertData: Omit<TemperatureAlert, "id" | "acknowledged">) => {
      const newAlert: TemperatureAlert = {
        ...alertData,
        id: `be-${alertIdCounter.current++}`,
        acknowledged: false,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 100));
    });

    return () => {
      socket.off("temperature:new");
      socket.off("temperature:alert");
      socket.off("connect");
      socket.off("disconnect");
      disconnectSocket();
    };
  }, [fetchInitialData]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }, []);

  return {
    latestReadings,
    districtStats,
    alerts,
    connected,
    loading,
    error,
    acknowledgeAlert,
  };
}
