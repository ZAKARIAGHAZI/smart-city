/**
 * Raw temperature reading from a sensor (via Kafka → Backend → Socket.IO)
 */
export interface TemperatureReading {
  sensor_id: string;
  city: string;
  district: string;
  temperature: number;
  unit: string;
  timestamp: string;
}

/**
 * Aggregated temperature stats per district (from /api/temperatures/avg-by-district)
 */
export interface DistrictTemperature {
  district: string;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  sensor_count: number;
  last_update: string;
}

/**
 * Temperature alert (triggered when temperature >= 35°C)
 */
export interface TemperatureAlert {
  id: string;
  sensor_id: string;
  district: string;
  temperature: number;
  timestamp: string;
  acknowledged: boolean;
}

/**
 * Temperature level classification
 */
export type TemperatureLevel = "normal" | "warm" | "critical";

export function getTemperatureLevel(temp: number): TemperatureLevel {
  if (temp >= 32) return "critical";
  if (temp >= 25) return "warm";
  return "normal";
}

export function getTemperatureLevelColor(level: TemperatureLevel): string {
  switch (level) {
    case "normal":
      return "#3b82f6"; // blue
    case "warm":
      return "#f59e0b"; // amber
    case "critical":
      return "#ef4444"; // red
  }
}

export function getTemperatureLevelLabel(level: TemperatureLevel): string {
  switch (level) {
    case "normal":
      return "Normale";
    case "warm":
      return "Chaude";
    case "critical":
      return "Critique";
  }
}

export function getTemperatureFillColor(temp: number): string {
  if (temp >= 35) return "#dc2626";   // red-600
  if (temp >= 32) return "#ef4444";   // red-500
  if (temp >= 29) return "#f97316";   // orange-500
  if (temp >= 25) return "#f59e0b";   // amber-500
  if (temp >= 20) return "#fbbf24";   // yellow-400
  if (temp >= 15) return "#60a5fa";   // blue-400
  return "#93c5fd";                   // blue-300
}
