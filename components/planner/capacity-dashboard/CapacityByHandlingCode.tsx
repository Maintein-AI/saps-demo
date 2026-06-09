"use client";

import ScopeBadge from "@/components/ScopeBadge";

const codes = [
  { code: "ICG", label: "General", occupied: 420, total: 650, color: "#1B4F8B" },
  { code: "GCR", label: "General Cargo", occupied: 310, total: 450, color: "#14B8A6" },
  { code: "AFU", label: "Air Freight", occupied: 85, total: 120, color: "#D97706" },
  { code: "UAB", label: "UAB", occupied: 45, total: 80, color: "#6366F1" },
  { code: "DGR", label: "Dangerous", occupied: 28, total: 45, color: "#EF4444" },
  { code: "VAL", label: "Valuable", occupied: 18, total: 35, color: "#8B5CF6" },
  { code: "HUM", label: "Human Remains", occupied: 5, total: 12, color: "#64748B" },
  { code: "DIP", label: "Diplomatic", occupied: 8, total: 20, color: "#0B2545" },
  { code: "PER", label: "Perishable", occupied: 41, total: 48, color: "#06B6D4" },
  { code: "AOG", label: "AOG", occupied: 6, total: 15, color: "#F59E0B" },
  { code: "VUN", label: "Vulnerable", occupied: 12, total: 25, color: "#EC4899" },
  { code: "AVI", label: "Live Animals", occupied: 3, total: 10, color: "#84CC16" },
];

export default function CapacityByHandlingCode() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Capacity by Handling Code</h2>
        <ScopeBadge type="inc" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {codes.map((c) => {
          const pct = (c.occupied / c.total) * 100;
          return (
            <div key={c.code} className="rounded-[12px] border border-[#E2E8F0] p-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#0F172A]" style={{ color: c.color }}>{c.code}</span>
                <span className="text-[11px] font-medium text-[#64748B]">{c.label}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-[#F8FAFC] mb-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#0F172A]">{c.occupied} <span className="text-[#94A3B8]">/ {c.total}</span></span>
                <span className="text-[12px] font-bold" style={{ color: pct > 85 ? "#EF4444" : pct > 70 ? "#D97706" : "#10B981" }}>{pct.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}