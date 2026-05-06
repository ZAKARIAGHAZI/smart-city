import { Car, Droplet, Wind, Thermometer, Zap, Lightbulb, Trash2 } from "lucide-react";

export type DomainId = 
  | "traffic_congestion" 
  | "water_consumption" 
  | "water_quality" 
  | "air_quality" 
  | "temperature" 
  | "energy_consumption" 
  | "street_lighting" 
  | "waste_level";

export interface SubDomain {
  id: DomainId;
  label: string;
  icon: any; // LucideIcon
  colorClass: string; 
  bgClass: string;
}

export interface DomainCategory {
  title: string;
  items: SubDomain[];
}

export const SMART_CITY_DOMAINS: DomainCategory[] = [
  {
    title: "Trafic et mobilité",
    items: [
      { id: "traffic_congestion", label: "Détection de congestion", icon: Car, colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
    ]
  },
  {
    title: "Gestion de l'eau",
    items: [
      { id: "water_consumption", label: "Consommation d'eau", icon: Droplet, colorClass: "text-blue-600", bgClass: "bg-blue-50" },
      { id: "water_quality", label: "Qualité de l'eau", icon: Droplet, colorClass: "text-cyan-600", bgClass: "bg-cyan-50" },
    ]
  },
  {
    title: "Surveillance environnementale",
    items: [
      { id: "air_quality", label: "Qualité de l'air", icon: Wind, colorClass: "text-teal-600", bgClass: "bg-teal-50" },
      { id: "temperature", label: "Température", icon: Thermometer, colorClass: "text-orange-600", bgClass: "bg-orange-50" },
    ]
  },
  {
    title: "Énergie intelligente",
    items: [
      { id: "energy_consumption", label: "Consommation électrique", icon: Zap, colorClass: "text-yellow-600", bgClass: "bg-yellow-50" },
      { id: "street_lighting", label: "Eclairage public intelligent", icon: Lightbulb, colorClass: "text-amber-500", bgClass: "bg-amber-50" },
    ]
  },
  {
    title: "Déchets et propreté",
    items: [
      { id: "waste_level", label: "Niveau de remplissage", icon: Trash2, colorClass: "text-stone-600", bgClass: "bg-stone-50" },
    ]
  }
];
