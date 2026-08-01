"use client";

import { useState } from "react";
import { ZoneCapacity } from "@/components/planner/capacity-dashboard/types";

const riskMap: Record<string, { color: string; bg: string }> = {
  "Low": { color: "#10B981", bg: "#D1FAE5" },
  "Medium": { color: "#D97706", bg: "#FEF3C7" },
  "High": { color: "#EF4444", bg: "#FEE2E2" },
};

const statusMap: Record<string, { color: string; bg: string }> = {
  "Active": { color: "#10B981", bg: "#D1FAE5" },
  "Blocked": { color: "#64748B", bg: "#F8FAFC" },
  "Over-capacity": { color: "#EF4444", bg: "#FEE2E2" },
  "Maintenance": { color: "#D97706", bg: "#FEF3C7" },
};

export default function CapacityTable({
  data,
  onViewMap,
  onOpenSlot,
}: {
  data: ZoneCapacity[];
  onViewMap: (z: ZoneCapacity) => void;
  onOpenSlot: (z: ZoneCapacity) => void;
}) {
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">Zone Capacity Table</h2>
          <span className="text-[12px] text-[#94A3B8] ml-2">{data.length} zones</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Zone</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Handling Class</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Total</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Occupied</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Available</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Blocked</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Utilisation %</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Forecast Inbound</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Risk Level</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const riskStyle = riskMap[row.riskLevel] || riskMap["Low"];
              return (
                <tr key={row.zone + row.handlingClass} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A]">{row.zone}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">
                      {row.handlingClass}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{row.totalLocations}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0F172A]">{row.occupied}</td>
                  <td className="px-4 py-3 text-[13px] text-[#10B981] font-semibold">{row.available}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{row.blocked}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-semibold ${row.utilization > 85 ? "text-[#EF4444]" : row.utilization > 70 ? "text-[#D97706]" : "text-[#10B981]"}`}>
                        {row.utilization}%
                      </span>
                      <div className="w-16 h-2 rounded-full overflow-hidden bg-[#F8FAFC]">
                        <div className="h-full rounded-full transition-all" style={{ width: `${row.utilization}%`, backgroundColor: row.utilization > 85 ? "#EF4444" : row.utilization > 70 ? "#D97706" : "#10B981" }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{row.forecastInbound}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: riskStyle.color, backgroundColor: riskStyle.bg }}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === row.zone + row.handlingClass ? null : row.zone + row.handlingClass); }}
                        className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                      {actionMenu === row.zone + row.handlingClass && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onOpenSlot(row); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Open Slot Planner
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onViewMap(row); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"/>
                              <line x1="8" y1="2" x2="8" y2="18"/>
                              <line x1="16" y1="6" x2="16" y2="22"/>
                            </svg>
                            View Storage Map
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}