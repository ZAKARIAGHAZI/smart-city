import zonesGeoJSONJson from "./json/zones.json";

export interface ZoneProperties {
  id: string;
  name: string;
  nameAr: string;
  energy: number;
  water: number;
  vehicles: number;
  temperature: number;
  humidity: number;
  aqi: number;
  noise: number;
  wasteFill: number;
  parkingOccupancy: number;
  sensorCount: number;
}

export type MetricKey = keyof Pick<
  ZoneProperties,
  "energy" | "water" | "vehicles" | "aqi" | "noise" | "temperature"
>;

export interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  icon: string;
  colors: string[];
  thresholds: { label: string; color: string }[];
}

export const METRICS: MetricConfig[] = [
  {
    key: "energy",
    label: "Énergie",
    unit: "kWh",
    icon: "⚡",
    colors: ["#fef3c7", "#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
    thresholds: [
      { label: "Faible", color: "#fef3c7" },
      { label: "Élevée", color: "#b45309" },
    ],
  },
  {
    key: "water",
    label: "Eau",
    unit: "m³",
    icon: "💧",
    colors: ["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
    thresholds: [
      { label: "Faible", color: "#dbeafe" },
      { label: "Élevée", color: "#1d4ed8" },
    ],
  },
  {
    key: "vehicles",
    label: "Véhicules",
    unit: "",
    icon: "🚗",
    colors: ["#d1fae5", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857"],
    thresholds: [
      { label: "Faible", color: "#d1fae5" },
      { label: "Dense", color: "#047857" },
    ],
  },
  {
    key: "aqi",
    label: "Qualité Air",
    unit: "AQI",
    icon: "🌬️",
    colors: ["#d1fae5", "#a7f3d0", "#fde68a", "#fdba74", "#f87171", "#dc2626"],
    thresholds: [
      { label: "Bon", color: "#d1fae5" },
      { label: "Dangereux", color: "#dc2626" },
    ],
  },
  {
    key: "noise",
    label: "Bruit",
    unit: "dB",
    icon: "🔊",
    colors: ["#ede9fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"],
    thresholds: [
      { label: "Calme", color: "#ede9fe" },
      { label: "Fort", color: "#6d28d9" },
    ],
  },
  {
    key: "temperature",
    label: "Température",
    unit: "°C",
    icon: "🌡️",
    colors: ["#dbeafe", "#bfdbfe", "#fde68a", "#fdba74", "#f87171", "#ef4444"],
    thresholds: [
      { label: "Froid", color: "#dbeafe" },
      { label: "Chaud", color: "#ef4444" },
    ],
  },
];

export const zonesGeoJSON = zonesGeoJSONJson;

export interface Landmark {
  id: string;
  name: string;
  position: [number, number];
  icon: string;
  type: string;
}
