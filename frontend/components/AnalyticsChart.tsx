"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Loader } from "lucide-react";

export type ChartType = "column" | "nightingale" | "table" | "pie" | "gauge" | "line";

interface AnalyticsChartProps {
  type: ChartType;
  data: any[];
  loading: boolean;
  color?: string;
  label?: string;
  unit?: string;
  xAxisKey?: string;
  yAxisKey?: string;
}

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];

export default function AnalyticsChart({
  type,
  data,
  loading,
  color = "#3b82f6",
  label = "Valeur",
  unit = "",
  xAxisKey = "name",
  yAxisKey = "value",
}: AnalyticsChartProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <Loader className="w-10 h-10 text-gray-300 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Traitement des données Big Data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">Aucune donnée disponible pour cette sélection.</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                unit={unit}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ color: color, fontWeight: 700 }}
              />
              <Line 
                type="monotone" 
                dataKey={yAxisKey} 
                stroke={color} 
                strokeWidth={4} 
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "column":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                unit={unit}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ backgroundColor: "#fff", borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Bar 
                dataKey={yAxisKey} 
                radius={[8, 8, 0, 0]} 
                barSize={32}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        );

      case "nightingale":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={(entry: any) => 60 + (entry.value / Math.max(...data.map(d => d.value))) * 60}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                animationDuration={1500}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    // Vary radius based on value for Nightingale effect
                    strokeWidth={2}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "gauge":
        const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 100;
        const gaugeData = data.slice(0, 5).map((d, i) => ({
          name: d[xAxisKey],
          value: d[yAxisKey],
          fill: COLORS[i % COLORS.length]
        }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="30%" 
              outerRadius="100%" 
              barSize={15} 
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                background
                dataKey="value"
                animationDuration={1500}
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case "table":
        return (
          <div className="w-full h-full overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-widest">{xAxisKey}</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">{label}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-700">{row[xAxisKey]}</td>
                    <td className="py-4 px-6 font-black text-gray-900 text-right tabular-nums">
                      {row[yAxisKey].toLocaleString()} <span className="text-[10px] text-gray-400">{unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full p-4">
      {renderChart()}
    </div>
  );
}
