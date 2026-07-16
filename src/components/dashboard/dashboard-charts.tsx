"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const STAGE_COLORS: Record<string, string> = {
  "Lead / Prospect": "#3b82f6", // blue
  "Meeting Scheduled": "#8b5cf6", // purple
  "Proposal Sent": "#f59e0b", // amber
  "Negotiation": "#f97316", // orange
  "Closed Won": "#10b981", // emerald
  "Closed Lost": "#ef4444", // red
};

const FALLBACK_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

type StageData = {
  name: string;
  value: number;
};

type ForecastData = {
  name: string;
  expected: number;
  weighted: number;
};

export function DashboardCharts({
  stageDistribution,
  forecastData,
}: {
  stageDistribution: StageData[];
  forecastData: ForecastData[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Pipeline by Stage Pie Chart */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <h3 className="text-lg font-medium text-white mb-6">Deals by Stage</h3>
        <div className="h-80 w-full">
          {stageDistribution.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No active deals yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageDistribution}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, "Deals"]}
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#cbd5e1" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Weighted Forecast Bar Chart */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <h3 className="text-lg font-medium text-white mb-6">Weighted Forecast Revenue</h3>
        <div className="h-80 w-full">
          {forecastData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No forecast data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)" }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#94a3b8", marginBottom: "8px" }}
                />
                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                <Bar dataKey="expected" name="Total Pipeline" fill="#475569" radius={[6, 6, 0, 0]}>
                  {forecastData.map((entry, index) => (
                    <Cell key={`cell-exp-${index}`} fill={STAGE_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} fillOpacity={0.3} />
                  ))}
                </Bar>
                <Bar dataKey="weighted" name="Weighted Forecast" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {forecastData.map((entry, index) => (
                    <Cell key={`cell-weight-${index}`} fill={STAGE_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
