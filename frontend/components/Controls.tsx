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
    <aside className="w-sm min-w-80 h-screen /40 backdrop-blur-md border-r border-gray-200 flex flex-col overflow-y-auto bg-[#fafaf8]">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 mb-6">
        <h1 className="text-4xl font-bold tracking-wide text-center">
          El Jadida
        </h1>
      </div>

      {/* Data Displayed & Visualization Options */}
      <div className="space-y-2 px-2">
        {SMART_CITY_DOMAINS.map((category, idx) => (
          <div key={idx}>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = mode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onModeChange(item.id)}
                    className={`cursor-pointer w-full flex items-center gap-2.5 px-1 pe-4 py-1 rounded-full font-semibold transition-all text-left ${
                      isActive
                        ? ` ring-2 ring-gray-200 ${item.colorClass} bg-white`
                        : "text-gray-900 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex justify-center items-center rounded-full p-2 ${item.bgClass}`}
                    >
                      <Icon className={`w-6 h-6 text-black`} />
                    </div>

                    <span className="flex-1 text-base font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-auto px-5 py-2 border-t border-gray-100 bg-gray-50/50">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-lg font-extrabold text-gray-800">
              {sensorCount}
            </span>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Capteurs
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">
              <Thermometer className="w-4 h-4" />
            </span>
            <span className="text-lg font-extrabold text-gray-800">
              {districtCount}
            </span>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Districts
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
