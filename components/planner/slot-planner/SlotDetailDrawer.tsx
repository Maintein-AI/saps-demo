"use client";

import { useState } from "react";
import { Slot, SlotStatus } from "@/components/planner/slot-planner/types";

const statusStyle: Record<SlotStatus, { color: string; bg: string; border: string }> = {
  "Available": { color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0" },
  "Booked": { color: "#1B4F8B", bg: "#EBF0F7", border: "#1B4F8B" },
  "In Progress": { color: "#10B981", bg: "#D1FAE5", border: "#10B981" },
  "Completed": { color: "#64748B", bg: "#E2E8F0", border: "#64748B" },
  "Conflict": { color: "#EF4444", bg: "#FEE2E2", border: "#EF4444" },
  "Blocked": { color: "#D97706", bg: "#FEF3C7", border: "#D97706" },
};

export default function SlotDetailDrawer({
  isOpen,
  onClose,
  slot,
}: {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot | null;
}) {
  const [activeTab, setActiveTab] = useState("details");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Slot Detail</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer rounded-lg hover:bg-[#F8FAFC] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {slot ? (
            <div className="flex flex-col gap-5">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap" style={{
                  color: statusStyle[slot.status as SlotStatus].color,
                  backgroundColor: statusStyle[slot.status as SlotStatus].bg,
                  border: `1px solid ${statusStyle[slot.status as SlotStatus].border}`,
                }}>
                  {slot.status}
                </span>
                {slot.conflictStatus !== "None" && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold bg-[#FEE2E2] text-[#EF4444] border border-[#FEE2E2] whitespace-nowrap">
                    Conflict: {slot.conflictStatus}
                  </span>
                )}
              </div>

              {/* Tab switcher */}
              <div className="inline-flex items-center gap-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full p-1">
                {["details", "team", "history"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${
                      activeTab === tab ? "text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                    style={{ backgroundColor: activeTab === tab ? "#0B2545" : "transparent" }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Details tab */}
              {activeTab === "details" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Slot ID", value: slot.slotId },
                        { label: "Bay / Resource", value: slot.bay },
                        { label: "Date", value: slot.date },
                        { label: "Start Time", value: slot.startTime },
                        { label: "End Time", value: slot.endTime },
                        { label: "AWB #", value: slot.awbNo },
                        { label: "Vehicle #", value: slot.vehicleNo },
                        { label: "DO #", value: slot.doNo },
                        { label: "Cargo Class", value: slot.cargoClass },
                        { label: "Expected Pieces", value: slot.expectedPieces.toString() },
                        { label: "Expected Weight", value: `${slot.expectedWeight} kg` },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-[12px] font-medium text-[#64748B]">{item.label}</span>
                          <span className="text-[13px] font-semibold text-[#0F172A]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {slot.notes && (
                    <div>
                      <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Notes</label>
                      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[13px] text-[#0F172A]">
                        {slot.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Team tab */}
              {activeTab === "team" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Assigned Team", value: slot.assignedTeam },
                        { label: "Assigned Lifter", value: slot.assignedLifter },
                        { label: "Conflict Status", value: slot.conflictStatus },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-[12px] font-medium text-[#64748B]">{item.label}</span>
                          <span className="text-[13px] font-semibold text-[#0F172A]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* History tab */}
              {activeTab === "history" && (
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <span className="text-[12px] font-medium text-[#64748B] block mb-2">Audit Trail</span>
                  <div className="text-[12px] text-[#64748B] whitespace-pre-wrap">
                    {`04 Jun 2026 06:00: Slot created by planner
04 Jun 2026 08:00: Bay assigned to ${slot.bay}
04 Jun 2026 08:30: Team ${slot.assignedTeam} assigned
04 Jun 2026 09:00: Lifter ${slot.assignedLifter} assigned
${slot.status === "In Progress" ? "04 Jun 2026 10:00: Slot started" : ""}
${slot.status === "Completed" ? "04 Jun 2026 11:00: Slot completed" : ""}`}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
                    Move Slot
                  </button>
                  <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                    Assign Team
                  </button>
                  <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                    Assign Lifter
                  </button>
                  <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
                    View AWB
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="h-9 px-3 rounded-xl border border-[#EF4444]/30 text-[13px] font-semibold text-[#EF4444] hover:bg-[#FEE2E2] cursor-pointer transition-colors whitespace-nowrap">
                    Cancel Slot
                  </button>
                  {slot.conflictStatus !== "None" && (
                    <button className="h-9 px-3 rounded-xl border border-[#D97706]/30 text-[13px] font-semibold text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer transition-colors whitespace-nowrap">
                      Resolve Conflict
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[13px] text-[#64748B]">
              Select a slot to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}