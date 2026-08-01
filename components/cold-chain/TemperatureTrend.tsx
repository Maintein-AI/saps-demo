"use client";

import { useState } from "react";
import { TrendingUp, Calendar, Filter, Download, Thermometer } from "lucide-react";

const REGIME_OPTIONS = ["All Regimes", "ERT", "COL", "CRT", "FRO"];
const SENSOR_OPTIONS = ["All Sensors", "S-ERT-01", "S-ERT-02", "S-COL-01", "S-COL-02", "S-COL-03", "S-CRT-01", "S-CRT-02", "S-FRO-01", "S-FRO-02"];

interface TemperatureTrendProps {
  selectedRegime: string | null;
  onExportLog: () => void;
}

export default function TemperatureTrend({ selectedRegime, onExportLog }: TemperatureTrendProps) {
  const [regime, setRegime] = useState(selectedRegime ? selectedRegime.toUpperCase() : "All Regimes");
  const [sensor, setSensor] = useState("All Sensors");
  const [dateRange, setDateRange] = useState("Last 24 hours");
  const [anomalyOnly, setAnomalyOnly] = useState(false);

  const trendData = [
    { time: "00:00", temp: 5.1, threshold: 5.0 },
    { time: "02:00", temp: 5.0, threshold: 5.0 },
    { time: "04:00", temp: 5.3, threshold: 5.0 },
    { time: "06:00", temp: 5.2, threshold: 5.0 },
    { time: "08:00", temp: 5.4, threshold: 5.0 },
    { time: "10:00", temp: 5.2, threshold: 5.0 },
    { time: "12:00", temp: 5.1, threshold: 5.0 },
    { time: "14:00", temp: 5.3, threshold: 5.0 },
    { time: "16:00", temp: 5.2, threshold: 5.0 },
    { time: "18:00", temp: 5.0, threshold: 5.0 },
    { time: "20:00", temp: 4.9, threshold: 5.0 },
    { time: "22:00", temp: 5.1, threshold: 5.0 },
  ];

  const maxTemp = Math.max(...trendData.map((d) => d.temp));
  const minTemp = Math.min(...trendData.map((d) => d.temp));
  const range = maxTemp - minTemp || 1;

  const height = 180;
  const width = trendData.length * 60;
  const padding = 20;

  const getX = (index: number) => padding + (index / (trendData.length - 1)) * (width - padding * 2);
  const getY = (temp: number) => height - padding - ((temp - minTemp) / range) * (height - padding * 2);

  const tempLine = trendData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.temp)}`).join(" ");
  const thresholdLine = trendData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.threshold)}`).join(" ");

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Temperature Trend</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportLog}
            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
          >
            <Download size={14} />
            Export Log
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Filter size={14} />
          </div>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="h-9 pl-9 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#0F172A] cursor-pointer appearance-none outline-none focus:border-[#1B4F8B] transition-colors"
          >
            {REGIME_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Thermometer size={14} />
          </div>
          <select
            value={sensor}
            onChange={(e) => setSensor(e.target.value)}
            className="h-9 pl-9 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#0F172A] cursor-pointer appearance-none outline-none focus:border-[#1B4F8B] transition-colors"
          >
            {SENSOR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Calendar size={14} />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 pl-9 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#0F172A] cursor-pointer appearance-none outline-none focus:border-[#1B4F8B] transition-colors"
          >
            <option>Last 1 hour</option>
            <option>Last 6 hours</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
          </select>
        </div>

        <button
          onClick={() => setAnomalyOnly((a) => !a)}
          className="h-9 px-3 rounded-lg border text-[12px] font-medium cursor-pointer transition-colors"
          style={{
            backgroundColor: anomalyOnly ? "#FEE2E2" : "white",
            borderColor: anomalyOnly ? "#DC2626" : "#E2E8F0",
            color: anomalyOnly ? "#DC2626" : "#64748B",
          }}
        >
          Anomaly Only
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg width="100%" height={height + 40} viewBox={`0 0 ${width} ${height + 40}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B4F8B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1B4F8B" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={tempLine + ` L ${getX(trendData.length - 1)},${height} L ${getX(0)},${height} Z`}
            fill="url(#tempGradient)"
          />
          <path d={tempLine} fill="none" stroke="#1B4F8B" strokeWidth="2" />
          <path d={thresholdLine} fill="none" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" />

          {trendData.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.temp)} r="4" fill="white" stroke="#1B4F8B" strokeWidth="2" />
              <text x={getX(i)} y={height - 2} textAnchor="middle" fill="#64748B" fontSize="10">
                {d.time}
              </text>
            </g>
          ))}

          <text x={width - 10} y={getY(5.2) - 10} textAnchor="end" fill="#1B4F8B" fontSize="11" fontWeight="600">
            Temperature
          </text>
          <text x={width - 10} y={getY(5.0) + 20} textAnchor="end" fill="#DC2626" fontSize="11" fontWeight="600">
            Threshold
          </text>
        </svg>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1B4F8B]" />
          <span className="text-[12px] text-[#64748B]">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#DC2626] border-dashed" />
          <span className="text-[12px] text-[#64748B]">Threshold</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <TrendingUp size={14} className="text-[#16A34A]" />
          <span className="text-[12px] text-[#16A34A] font-medium">Within range</span>
        </div>
      </div>
    </div>
  );
}