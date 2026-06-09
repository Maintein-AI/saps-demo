"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { SlotConflict } from "@/components/planner/slot-planner/types";

const severityMap: Record<string, { color: string; bg: string }> = {
  "High": { color: "#EF4444", bg: "#FEE2E2" },
  "Medium": { color: "#D97706", bg: "#FEF3C7" },
  "Low": { color: "#10B981", bg: "#D1FAE5" },
};

const sampleConflicts: SlotConflict[] = [
  { id: "1", conflictId: "C-001", resource: "ULD Bay 02", time: "13:00 - 15:00", awbNo: "420-4321098", vehicleNo: "LHR-3345", conflictType: "Double booking", severity: "High" },
  { id: "2", conflictId: "C-002", resource: "Cold Room COL", time: "10:00 - 12:00", awbNo: "420-4321098", vehicleNo: "LHR-2931", conflictType: "Capacity exceeded", severity: "High" },
  { id: "3", conflictId: "C-003", resource: "DGR Segregation Area", time: "10:00 - 11:00", awbNo: "420-9876543", vehicleNo: "KHI-1356", conflictType: "DGR segregation conflict", severity: "High" },
  { id: "4", conflictId: "C-004", resource: "Vehicle Bay 01", time: "15:00 - 16:00", awbNo: "420-7654321", vehicleNo: "RWP-4921", conflictType: "Vehicle bay unavailable", severity: "Medium" },
  { id: "5", conflictId: "C-005", resource: "Cold Room FRO", time: "07:00 - 09:00", awbNo: "420-3210987", vehicleNo: "RWP-4921", conflictType: "Cold-chain mismatch", severity: "Medium" },
  { id: "6", conflictId: "C-006", resource: "ULD Bay 01", time: "08:00 - 10:00", awbNo: "420-9876543", vehicleNo: "LHR-2847", conflictType: "Double booking", severity: "Low" },
];

export default function ConflictPanel({
  onResolve,
}: {
  onResolve: (c: SlotConflict) => void;
}) {
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Slot Conflicts</h2>
        <ScopeBadge type="inc" />
        <span className="text-[12px] text-[#94A3B8] ml-2">{sampleConflicts.length} conflicts</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Conflict ID</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Resource</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Time</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">AWB #</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Vehicle #</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Conflict Type</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Severity</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleConflicts.map((c) => {
              const sevStyle = severityMap[c.severity] || severityMap["Low"];
              return (
                <tr key={c.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#0F172A] font-mono">{c.conflictId}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A]">{c.resource}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{c.time}</td>
                  <td className="px-4 py-3 text-[13px] text-[#1B4F8B] font-semibold">{c.awbNo}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{c.vehicleNo}</td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{c.conflictType}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ color: sevStyle.color, backgroundColor: sevStyle.bg }}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === c.id ? null : c.id); }}
                        className="w-6 h-6 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded hover:bg-[#E2E8F0] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                      {actionMenu === c.id && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); onResolve(c); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                            Resolve Conflict
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                            Edit Slot
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