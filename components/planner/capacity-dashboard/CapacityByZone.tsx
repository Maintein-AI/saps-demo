"use client";

import ScopeBadge from "@/components/ScopeBadge";

const zones = [
  { name: "Standard Pallet", used: 310, available: 126, blocked: 14, total: 450 },
  { name: "Wide-bay 2-level", used: 180, available: 95, blocked: 10, total: 285 },
  { name: "Cantilever", used: 92, available: 48, blocked: 5, total: 145 },
  { name: "ODC Block-stacking", used: 27, available: 4, blocked: 1, total: 32 },
  { name: "Vertical Carousel", used: 48, available: 22, blocked: 0, total: 70 },
  { name: "Drive-in", used: 65, available: 35, blocked: 2, total: 102 },
  { name: "Cold Room", used: 41, available: 5, blocked: 2, total: 48 },
  { name: "ULD Pits", used: 12, available: 8, blocked: 2, total: 22 },
];

export default function CapacityByZone() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Capacity by Zone</h2>
        <ScopeBadge type="inc" />
      </div>
      <div className="flex flex-col gap-3">
        {zones.map((z) => {
          const usedPct = (z.used / z.total) * 100;
          const availablePct = (z.available / z.total) * 100;
          const blockedPct = (z.blocked / z.total) * 100;
          return (
            <div key={z.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-[#0F172A]">{z.name}</span>
                <span className="text-[12px] text-[#64748B]">{z.used} / {z.total} <span className="text-[#94A3B8]">({usedPct.toFixed(0)}%)</span></span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#F8FAFC]">
                <div className="h-full" style={{ width: `${usedPct}%`, backgroundColor: "#1B4F8B" }} />
                <div className="h-full" style={{ width: `${availablePct}%`, backgroundColor: "#D1FAE5" }} />
                <div className="h-full" style={{ width: `${blockedPct}%`, backgroundColor: "#E2E8F0" }} />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1B4F8B" }} />
                  Used {z.used}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D1FAE5" }} />
                  Available {z.available}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }} />
                  Blocked {z.blocked}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}