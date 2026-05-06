"use client";

import { useEffect, useState } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { TemperatureReading } from "@/lib/types";
import { getTemperatureFillColor } from "@/lib/types";
import { sensorsData } from "@/data/sensors";

interface TemperatureSensorsLayerProps {
  latestReadings: TemperatureReading[];
  visible: boolean;
}

export default function TemperatureSensorsLayer({
  latestReadings,
  visible,
}: TemperatureSensorsLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [animatingSensors, setAnimatingSensors] = useState<Set<string>>(new Set());

  // Track map zoom
  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoomend", onZoom);
    return () => { map.off("zoomend", onZoom); };
  }, [map]);

  // Watch for new readings and trigger animation
  useEffect(() => {
    if (!latestReadings || latestReadings.length === 0) return;
    
    const now = Date.now();
    const newAnims = new Set<string>();
    
    latestReadings.forEach(reading => {
      const timeDiff = now - new Date(reading.timestamp).getTime();
      // If reading is newer than 3 seconds
      if (timeDiff < 3000) {
        newAnims.add(reading.sensor_id);
      }
    });

    if (newAnims.size > 0) {
      setAnimatingSensors(prev => {
        const merged = new Set(prev);
        newAnims.forEach(id => merged.add(id));
        return merged;
      });

      // Clear the animation after 2.5 seconds
      const timeout = setTimeout(() => {
        setAnimatingSensors(prev => {
          const next = new Set(prev);
          newAnims.forEach(id => next.delete(id));
          return next;
        });
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [latestReadings]);

  if (!visible) return null;

  return (
    <>
      {sensorsData.map((sensor) => {
        const reading = latestReadings?.find((r) => r.sensor_id === sensor.id);
        const isAnimating = animatingSensors.has(sensor.id);
        
        let color = "#9ca3af"; // Gray for no data
        let tempStr = "—";
        let timeStr = "Aucune donnée";

        if (reading) {
          color = getTemperatureFillColor(reading.temperature);
          tempStr = reading.temperature.toFixed(1) + " °C";
          timeStr = "MAJ: " + new Date(reading.timestamp).toLocaleTimeString("fr-FR");
        }

        // Calculate dynamic size based on zoom (base size 8 at zoom 13)
        const scale = Math.pow(1.4, zoom - 13);
        const currentSize = Math.max(4, Math.min(32, Math.round(8 * scale)));

        // Create a custom HTML icon with dynamic pixel sizes
        const iconHtml = `
          <div style="position: relative; width: ${currentSize}px; height: ${currentSize}px;">
            ${isAnimating ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color:${color}"></span>` : ''}
            <span class="relative inline-flex rounded-full border-[1.5px] border-white shadow-sm" style="width: ${currentSize}px; height: ${currentSize}px; background-color:${color}"></span>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: "", // Disable default Leaflet background
          iconSize: [currentSize, currentSize],
          iconAnchor: [currentSize / 2, currentSize / 2],
        });

        return (
          <Marker
            key={sensor.id}
            position={[sensor.lat, sensor.lng]}
            icon={icon}
          >
            <Tooltip direction="top" offset={[0, -7]} opacity={1}>
              <div className="text-center font-sans">
                <div className="text-[10px] text-gray-500 mb-0.5 font-mono">${sensor.id}</div>
                <div className="text-[10px] text-blue-500 font-semibold">${sensor.districtName}</div>
                <div className="font-extrabold text-gray-800 text-sm mt-1">
                  ${tempStr}
                </div>
                <div className="text-[9px] text-gray-400 mt-1">
                  ${timeStr}
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
