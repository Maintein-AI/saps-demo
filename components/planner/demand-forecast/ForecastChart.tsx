"use client";

import { useMemo } from "react";
import ScopeBadge from "../../ScopeBadge";
import type { HourlyForecast } from "./types";

const hourlyData: HourlyForecast[] = [
  { hour: "06:00", pieces: 0, weight: 0 },
  { hour: "07:00", pieces: 120, weight: 2800 },
  { hour: "08:00", pieces: 340, weight: 6200 },
  { hour: "09:00", pieces: 580, weight: 10500 },
  { hour: "10:00", pieces: 420, weight: 7800 },
  { hour: "11:00", pieces: 260, weight: 4200 },
  { hour: "12:00", pieces: 380, weight: 6800 },
  { hour: "13:00", pieces: 520, weight: 9600 },
  { hour: "14:00", pieces: 410, weight: 7400 },
  { hour: "15:00", pieces: 290, weight: 5200 },
  { hour: "16:00", pieces: 180, weight: 3600 },
  { hour: "17:00", pieces: 220, weight: 4000 },
  { hour: "18:00", pieces: 150, weight: 3200 },
  { hour: "19:00", pieces: 80, weight: 1800 },
  { hour: "20:00", pieces: 40, weight: 900 },
  { hour: "21:00", pieces: 20, weight: 500 },
  { hour: "22:00", pieces: 0, weight: 0 },
  { hour: "23:00", pieces: 0, weight: 0 },
];

export default function ForecastChart() {
  const maxPieces = useMemo(() => Math.max(...hourlyData.map((d) => d.pieces)), []);
  const maxWeight = useMemo(() => Math.max(...hourlyData.map((d) => d.weight)), []);

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Forecast by Hour</span>
          <ScopeBadge type="inc" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#1B4F8B" }} />
            <span className="text-[11px] text-[#64748B]">Pieces</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#F59E0B" }} />
            <span className="text-[11px] text-[#64748B]">Weight (kg)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {hourlyData.map((row) => {
          const piecesWidth = maxPieces > 0 ? (row.pieces / maxPieces) * 100 : 0;
          const weightWidth = maxWeight > 0 ? (row.weight / maxWeight) * 100 : 0;
          return (
            <div key={row.hour} className="flex items-center gap-3">
              <span className="text-[11px] text-[#64748B] w-12 text-right flex-shrink-0">{row.hour}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 rounded-sm bg-[#F1F5F9] flex-1 overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${piecesWidth}%`, backgroundColor: "#1B4F8B" }} />
                  </div>
                  <span className="text-[11px] text-[#0F172A] w-10 text-right font-medium">{row.pieces}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 rounded-sm bg-[#F1F5F9] flex-1 overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${weightWidth}%`, backgroundColor: "#F59E0B" }} />
                  </div>
                  <span className="text-[11px] text-[#64748B] w-10 text-right">{row.weight.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}