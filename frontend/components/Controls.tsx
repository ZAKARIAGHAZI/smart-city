"use client";

import {
  Route,
  Activity,
  Radio,
  Wifi,
  WifiOff,
  Thermometer,
} from "lucide-react";
import { SMART_CITY_DOMAINS } from "@/data/domains";

interface ControlsProps {
  mode: string;
  onModeChange: (mode: string) => void;
  kafkaConnected: boolean;
  districtCount: number;
  sensorCount: number;
}

export default function Controls({
  mode,
  onModeChange,
  kafkaConnected,
  districtCount,
  sensorCount,
}: ControlsProps) {
  return (
    <aside className="w-80 min-w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 border-b border-gray-100">
          <h1 className="text-2xl font-black">
            Smart City - El Jadida
          </h1>
        <p className="mt-3 text-xs text-gray-500 leading-relaxed">
          Tableau de bord IoT — Données capteurs temps réel via Kafka
        </p>
      </div>

      {/* Kafka Connection Status */}
      <div className="px-5 py-2 border-b border-gray-100">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Source de données
        </label>
        <div className={`flex items-center gap-2 px-3.5 py-3 rounded-sm text-sm border ${kafkaConnected
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
          }`}>
          <Radio className={`w-4 h-4 ${kafkaConnected ? "text-green-500" : "text-red-400"}`} />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Apache Kafka</span>
            <span className="text-[10px] flex items-center gap-1 mt-0.5">
              {kafkaConnected ? (
                <><Wifi className="w-3 h-3 text-green-500" /> <span className="text-green-600">Connecté — Flux actif</span></>
              ) : (
                <><WifiOff className="w-3 h-3 text-red-400" /> <span className="text-red-500">Déconnecté</span></>
              )}
            </span>
          </div>
          {kafkaConnected && (
            <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>

        <div className="mt-2 px-3.5 py-2 bg-gray-50 rounded-sm">
          <p className="text-[10px] text-gray-400 font-mono">
            Topic: smartcity.temperature.readings
          </p>
        </div>
      </div>

      {/* Data Displayed & Visualization Options */}
      <div className="px-5 py-3 border-b border-gray-100 flex-1 overflow-y-auto">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Domaines & Flux de données
        </label>

        <div className="space-y-4">
          {SMART_CITY_DOMAINS.map((category) => (
            <div key={category.title}>
              <h4 className="text-[10px] font-bold text-gray-400 mb-2 pl-1">{category.title}</h4>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = mode === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onModeChange(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all text-left ${
                        isActive
                          ? `bg-white shadow-sm ring-1 ring-gray-200 ${item.colorClass}`
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? item.colorClass : "text-gray-400"}`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-auto px-5 py-2 border-t border-gray-100 bg-gray-50/50">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 mb-1"><Activity className="w-4 h-4" /></span>
            <span className="text-lg font-extrabold text-gray-800">{sensorCount}</span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400">Capteurs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400 mb-1"><Thermometer className="w-4 h-4" /></span>
            <span className="text-lg font-extrabold text-gray-800">{districtCount}</span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400">Districts</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
