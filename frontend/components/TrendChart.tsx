"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

interface DataPoint {
  time: string;
  value: number;
  isLive?: boolean;
}

interface TrendChartProps {
  data: DataPoint[];
  color: string;
  label: string;
  unit: string;
}

export default function TrendChart({ data, color, label, unit }: TrendChartProps) {
  // Find the point where live data starts
  const firstLiveIndex = data.findIndex(d => d.isLive);
  const liveStartTime = firstLiveIndex !== -1 ? data[firstLiveIndex].time : null;

  // Determine fixed Y-axis domain based on the label type
  let yDomainMin: number | 'auto' = 0;
  let yDomainMax: number | 'auto' = 100;

  switch (label) {
    case "Température":
      yDomainMin = 0;
      yDomainMax = 50;
      break;
    case "AQI":
      yDomainMin = 0;
      yDomainMax = 300;
      break;
    case "Vitesse":
      yDomainMin = 0;
      yDomainMax = 120;
      break;
    case "Débit":
      yDomainMin = 0;
      yDomainMax = 30;
      break;
    default:
      yDomainMin = 'auto';
      yDomainMax = 'auto';
  }

  return (
    <div className="w-full h-[220px] mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: -15, bottom: 25 }}
        >
          <defs>
            <linearGradient id={`colorGradient-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          
          <YAxis 
            domain={[yDomainMin, yDomainMax]} 
            tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 500 }} 
            axisLine={false}
            tickLine={false}
            width={50}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              border: "1px solid #f0f0f0",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            itemStyle={{ fontWeight: "bold" }}
            labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
            formatter={(val: number, name: string, props: any) => {
              const isLive = props.payload.isLive;
              return [
                <span className="flex items-center gap-2">
                  {val.toFixed(1)}{unit}
                  {isLive && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </span>,
                label
              ];
            }}
          />

          {liveStartTime && (
            <ReferenceLine 
              x={liveStartTime} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              strokeWidth={1}
            >
              <Label 
                value="LIVE" 
                position="top" 
                fill="#ef4444" 
                fontSize={9} 
                fontWeight="bold"
                offset={10}
              />
            </ReferenceLine>
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#colorGradient-${label})`}
            animationDuration={1500}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Custom Legend Overlay */}
      <div className="absolute top-0 right-2 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-0.5 bg-gray-300" />
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Historique 24h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-0.5 bg-red-500" />
          <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Flux Direct</span>
        </div>
      </div>
    </div>
  );
}
