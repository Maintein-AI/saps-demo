"use client";

import { useMemo } from "react";
import type { CargoMixItem } from "./types";

const cargoMixData: CargoMixItem[] = [
  { class: "ICG", count: 12, percentage: 8 },
  { class: "GCR", count: 48, percentage: 31 },
  { class: "AFU", count: 28, percentage: 18 },
  { class: "UAB", count: 15, percentage: 10 },
  { class: "DGR", count: 8, percentage: 5 },
  { class: "VAL", count: 14, percentage: 9 },
  { class: "HUM", count: 4, percentage: 3 },
  { class: "DIP", count: 6, percentage: 4 },
  { class: "PER", count: 10, percentage: 6 },
  { class: "AOG", count: 2, percentage: 1 },
  { class: "VUN", count: 5, percentage: 3 },
  { class: "AVI", count: 4, percentage: 2 },
];

const classColors: Record<string, string> = {
  ICG: "#64748B",
  GCR: "#1B4F8B",
  AFU: "#16A34A",
  UAB: "#0B2545",
  DGR: "#DC2626",
  VAL: "#F59E0B",
  HUM: "#8B5CF6",
  DIP: "#3B82F6",
  PER: "#06B6D4",
  AOG: "#EF4444",
  VUN: "#14B8A6",
  AVI: "#6366F1",
};

export default function CargoMixCard() {
  const totalCount = useMemo(() => cargoMixData.reduce((sum, c) => sum + c.count, 0), []);

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Expected Cargo Mix</span>
        </div>
        <span className="text-[12px] text-[#64748B]">{totalCount} AWBs</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {cargoMixData.map((item) => (
          <div key={item.class} className="rounded-lg border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: classColors[item.class] || "#94A3B8" }} />
              <span className="text-[13px] font-bold text-[#0F172A]">{item.class}</span>
            </div>
            <div className="text-[18px] font-bold text-[#0F172A] leading-tight">{item.count}</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{item.percentage}%</div>
            <div className="mt-2 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.percentage}%`, backgroundColor: classColors[item.class] || "#94A3B8" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}