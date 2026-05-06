"use client";

import { Route, Info } from "lucide-react";

export default function TrafficStats() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Route className="w-4 h-4 text-emerald-500" />
          Trafic Routier
        </h3>
        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          PRÉVU
        </span>
      </div>

      <div className="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-sm border border-blue-100 text-blue-800 flex gap-2 items-start">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Le flux Kafka pour le trafic n'est pas encore connecté. Espace réservé pour la future intégration.</p>
      </div>

      <div className="space-y-2 opacity-50 grayscale pointer-events-none">
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-gray-700">Av. Mohammed VI</span>
          </div>
          <span className="text-xs font-bold text-gray-800">Saturé</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs font-medium text-gray-700">Route de Marrakech</span>
          </div>
          <span className="text-xs font-bold text-gray-800">Dense</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-700">Corniche</span>
          </div>
          <span className="text-xs font-bold text-gray-800">Fluide</span>
        </div>
      </div>
    </div>
  );
}
