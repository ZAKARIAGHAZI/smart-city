import trafficRoutesJson from "./json/routes.json";

export interface TrafficRoute {
  id: string;
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  positions: [number, number][];
  traffic: "low" | "medium" | "high" | "critical";
  flowPerHour: number;
}

export const trafficRoutes = trafficRoutesJson as TrafficRoute[];

export function getTrafficColor(traffic: TrafficRoute["traffic"]): string {
  const map = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#dc2626",
  };
  return map[traffic];
}

export function getTrafficWeight(traffic: TrafficRoute["traffic"]): number {
  const map = { low: 3, medium: 4, high: 6, critical: 8 };
  return map[traffic];
}

export function getTrafficLabel(traffic: TrafficRoute["traffic"]): string {
  const map = {
    low: "Fluide",
    medium: "Modéré",
    high: "Dense",
    critical: "Critique",
  };
  return map[traffic];
}
