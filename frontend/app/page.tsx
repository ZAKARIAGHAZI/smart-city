"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <div className="text-center animate-pulse">
        <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-bold text-gray-800">Smart City · El Jadida</h2>
        <p className="text-sm text-gray-400 mt-1">Chargement des données capteurs…</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Map />;
}
