"use client";

import { useState } from "react";
import { Slot, SlotStatus } from "@/components/planner/slot-planner/types";

const statusStyle: Record<SlotStatus, { bg: string; text: string; border: string; icon: string }> = {
  "Available": { bg: "#F8FAFC", text: "#94A3B8", border: "#E2E8F0", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
  "Booked": { bg: "#EBF0F7", text: "#1B4F8B", border: "#1B4F8B", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
  "In Progress": { bg: "#D1FAE5", text: "#10B981", border: "#10B981", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
  "Completed": { bg: "#E2E8F0", text: "#64748B", border: "#64748B", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
  "Conflict": { bg: "#FEE2E2", text: "#EF4444", border: "#EF4444", icon: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" },
  "Blocked": { bg: "#FEF3C7", text: "#D97706", border: "#D97706", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
};

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const resources = [
  "ULD Bay 01", "ULD Bay 02", "ULD Bay 03",
  "Vehicle Bay 01", "Vehicle Bay 02", "Vehicle Bay 03",
  "Cold Room COL", "Cold Room FRO",
  "Inspection Bay", "DGR Segregation Area",
];

const sampleSlots: Slot[] = [
  { id: "1", slotId: "S-001", bay: "ULD Bay 01", date: "2026-06-04", startTime: "08:00", endTime: "10:00", awbNo: "420-9876543", vehicleNo: "LHR-2847", doNo: "DO-2026-0847", cargoClass: "GCR", expectedPieces: 45, expectedWeight: 320, assignedTeam: "Team Alpha", assignedLifter: "FLT-03", conflictStatus: "None", notes: "Standard cargo offload", status: "Completed" },
  { id: "2", slotId: "S-002", bay: "ULD Bay 01", date: "2026-06-04", startTime: "10:00", endTime: "12:00", awbNo: "420-8765432", vehicleNo: "LHR-2931", doNo: "DO-2026-0848", cargoClass: "AFU", expectedPieces: 22, expectedWeight: 180, assignedTeam: "Team Beta", assignedLifter: "FLT-05", conflictStatus: "None", notes: "Air freight priority", status: "In Progress" },
  { id: "3", slotId: "S-003", bay: "ULD Bay 01", date: "2026-06-04", startTime: "14:00", endTime: "16:00", awbNo: "420-7654321", vehicleNo: "LHR-3102", doNo: "DO-2026-0849", cargoClass: "GCR", expectedPieces: 38, expectedWeight: 250, assignedTeam: "Team Alpha", assignedLifter: "FLT-03", conflictStatus: "None", notes: "", status: "Booked" },
  { id: "4", slotId: "S-004", bay: "ULD Bay 02", date: "2026-06-04", startTime: "09:00", endTime: "11:00", awbNo: "420-6543210", vehicleNo: "LHR-3156", doNo: "DO-2026-0850", cargoClass: "VAL", expectedPieces: 12, expectedWeight: 85, assignedTeam: "Team Gamma", assignedLifter: "FLT-02", conflictStatus: "None", notes: "Valuable cargo — escort required", status: "In Progress" },
  { id: "5", slotId: "S-005", bay: "ULD Bay 02", date: "2026-06-04", startTime: "11:00", endTime: "13:00", awbNo: "420-5432109", vehicleNo: "LHR-3281", doNo: "DO-2026-0851", cargoClass: "DGR", expectedPieces: 8, expectedWeight: 140, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "UN 3480 — lithium batteries", status: "Booked" },
  { id: "6", slotId: "S-006", bay: "ULD Bay 02", date: "2026-06-04", startTime: "13:00", endTime: "15:00", awbNo: "420-4321098", vehicleNo: "LHR-3345", doNo: "DO-2026-0852", cargoClass: "GCR", expectedPieces: 55, expectedWeight: 410, assignedTeam: "Team Alpha", assignedLifter: "FLT-04", conflictStatus: "Double booking", notes: "Conflict detected", status: "Conflict" },
  { id: "7", slotId: "S-007", bay: "ULD Bay 03", date: "2026-06-04", startTime: "08:00", endTime: "09:30", awbNo: "420-3210987", vehicleNo: "LHR-3421", doNo: "DO-2026-0853", cargoClass: "AOG", expectedPieces: 6, expectedWeight: 95, assignedTeam: "Team Epsilon", assignedLifter: "FLT-01", conflictStatus: "None", notes: "AOG — aircraft on ground", status: "Completed" },
  { id: "8", slotId: "S-008", bay: "ULD Bay 03", date: "2026-06-04", startTime: "12:00", endTime: "14:00", awbNo: "420-2109876", vehicleNo: "LHR-3507", doNo: "DO-2026-0854", cargoClass: "GCR", expectedPieces: 30, expectedWeight: 220, assignedTeam: "Team Beta", assignedLifter: "FLT-06", conflictStatus: "None", notes: "", status: "Booked" },
  { id: "9", slotId: "S-009", bay: "Vehicle Bay 01", date: "2026-06-04", startTime: "07:00", endTime: "08:00", awbNo: "420-1098765", vehicleNo: "RWP-4921", doNo: "DO-2026-0855", cargoClass: "GCR", expectedPieces: 20, expectedWeight: 150, assignedTeam: "Team Alpha", assignedLifter: "FLT-03", conflictStatus: "None", notes: "", status: "Completed" },
  { id: "10", slotId: "S-010", bay: "Vehicle Bay 01", date: "2026-06-04", startTime: "10:00", endTime: "11:00", awbNo: "420-0987654", vehicleNo: "RWP-5032", doNo: "DO-2026-0856", cargoClass: "UAB", expectedPieces: 15, expectedWeight: 110, assignedTeam: "Team Gamma", assignedLifter: "FLT-02", conflictStatus: "None", notes: "", status: "In Progress" },
  { id: "11", slotId: "S-011", bay: "Vehicle Bay 02", date: "2026-06-04", startTime: "09:00", endTime: "10:00", awbNo: "420-9876543", vehicleNo: "KHI-1204", doNo: "DO-2026-0857", cargoClass: "GCR", expectedPieces: 25, expectedWeight: 180, assignedTeam: "Team Beta", assignedLifter: "FLT-05", conflictStatus: "None", notes: "", status: "Booked" },
  { id: "12", slotId: "S-012", bay: "Vehicle Bay 02", date: "2026-06-04", startTime: "14:00", endTime: "15:00", awbNo: "420-8765432", vehicleNo: "KHI-1356", doNo: "DO-2026-0858", cargoClass: "GCR", expectedPieces: 32, expectedWeight: 240, assignedTeam: "Team Alpha", assignedLifter: "FLT-03", conflictStatus: "None", notes: "", status: "Booked" },
  { id: "13", slotId: "S-013", bay: "Vehicle Bay 03", date: "2026-06-04", startTime: "08:00", endTime: "09:00", awbNo: "420-7654321", vehicleNo: "KHI-1423", doNo: "DO-2026-0859", cargoClass: "VUN", expectedPieces: 10, expectedWeight: 75, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "Fragile — handle with care", status: "Completed" },
  { id: "14", slotId: "S-014", bay: "Vehicle Bay 03", date: "2026-06-04", startTime: "11:00", endTime: "12:00", awbNo: "420-6543210", vehicleNo: "KHI-1589", doNo: "DO-2026-0860", cargoClass: "GCR", expectedPieces: 28, expectedWeight: 195, assignedTeam: "Team Gamma", assignedLifter: "FLT-02", conflictStatus: "None", notes: "", status: "In Progress" },
  { id: "15", slotId: "S-015", bay: "Cold Room COL", date: "2026-06-04", startTime: "06:00", endTime: "08:00", awbNo: "420-5432109", vehicleNo: "LHR-2847", doNo: "DO-2026-0861", cargoClass: "PER", expectedPieces: 18, expectedWeight: 120, assignedTeam: "Team Epsilon", assignedLifter: "FLT-01", conflictStatus: "None", notes: "Temperature: 2°C", status: "Completed" },
  { id: "16", slotId: "S-016", bay: "Cold Room COL", date: "2026-06-04", startTime: "10:00", endTime: "12:00", awbNo: "420-4321098", vehicleNo: "LHR-2931", doNo: "DO-2026-0862", cargoClass: "PER", expectedPieces: 22, expectedWeight: 145, assignedTeam: "Team Epsilon", assignedLifter: "FLT-01", conflictStatus: "Capacity exceeded", notes: "Cold room at 90%", status: "Conflict" },
  { id: "17", slotId: "S-017", bay: "Cold Room FRO", date: "2026-06-04", startTime: "07:00", endTime: "09:00", awbNo: "420-3210987", vehicleNo: "RWP-4921", doNo: "DO-2026-0863", cargoClass: "AVI", expectedPieces: 4, expectedWeight: 35, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "Live animals — temperature 18°C", status: "In Progress" },
  { id: "18", slotId: "S-018", bay: "Cold Room FRO", date: "2026-06-04", startTime: "13:00", endTime: "15:00", awbNo: "420-2109876", vehicleNo: "RWP-5032", doNo: "DO-2026-0864", cargoClass: "HUM", expectedPieces: 2, expectedWeight: 65, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "Priority handling", status: "Booked" },
  { id: "19", slotId: "S-019", bay: "Inspection Bay", date: "2026-06-04", startTime: "09:00", endTime: "10:30", awbNo: "420-1098765", vehicleNo: "LHR-3156", doNo: "DO-2026-0865", cargoClass: "DGR", expectedPieces: 8, expectedWeight: 140, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "UN 3480 inspection", status: "In Progress" },
  { id: "20", slotId: "S-020", bay: "Inspection Bay", date: "2026-06-04", startTime: "15:00", endTime: "16:00", awbNo: "420-0987654", vehicleNo: "KHI-1204", doNo: "DO-2026-0866", cargoClass: "DIP", expectedPieces: 6, expectedWeight: 50, assignedTeam: "Team Gamma", assignedLifter: "FLT-02", conflictStatus: "None", notes: "Diplomatic seal check", status: "Booked" },
  { id: "21", slotId: "S-021", bay: "DGR Segregation Area", date: "2026-06-04", startTime: "10:00", endTime: "11:00", awbNo: "420-9876543", vehicleNo: "KHI-1356", doNo: "DO-2026-0867", cargoClass: "DGR", expectedPieces: 8, expectedWeight: 140, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "DGR segregation conflict", notes: "Segregation zone full", status: "Conflict" },
  { id: "22", slotId: "S-022", bay: "DGR Segregation Area", date: "2026-06-04", startTime: "16:00", endTime: "17:00", awbNo: "420-8765432", vehicleNo: "KHI-1423", doNo: "DO-2026-0868", cargoClass: "DGR", expectedPieces: 5, expectedWeight: 85, assignedTeam: "Team Delta", assignedLifter: "FLT-07", conflictStatus: "None", notes: "", status: "Booked" },
  { id: "23", slotId: "S-023", bay: "Vehicle Bay 01", date: "2026-06-04", startTime: "15:00", endTime: "16:00", awbNo: "420-7654321", vehicleNo: "RWP-4921", doNo: "DO-2026-0869", cargoClass: "GCR", expectedPieces: 40, expectedWeight: 300, assignedTeam: "Team Alpha", assignedLifter: "FLT-03", conflictStatus: "None", notes: "", status: "Blocked" },
  { id: "24", slotId: "S-024", bay: "ULD Bay 03", date: "2026-06-04", startTime: "16:00", endTime: "18:00", awbNo: "420-6543210", vehicleNo: "LHR-3281", doNo: "DO-2026-0870", cargoClass: "GCR", expectedPieces: 42, expectedWeight: 310, assignedTeam: "Team Beta", assignedLifter: "FLT-05", conflictStatus: "None", notes: "", status: "Available" },
];

export default function CalendarGrid({
  onSlotClick,
}: {
  onSlotClick: (slot: Slot) => void;
}) {
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  const getSlotForCell = (resource: string, time: string): Slot | undefined => {
    return sampleSlots.find(s => {
      const startHour = parseInt(s.startTime.split(":")[0]);
      const endHour = parseInt(s.endTime.split(":")[0]);
      const cellHour = parseInt(time.split(":")[0]);
      return s.bay === resource && cellHour >= startHour && cellHour < endHour;
    });
  };

  const getSpanForSlot = (slot: Slot): number => {
    const startHour = parseInt(slot.startTime.split(":")[0]);
    const endHour = parseInt(slot.endTime.split(":")[0]);
    return endHour - startHour;
  };

  const getStartIndex = (slot: Slot): number => {
    const startHour = parseInt(slot.startTime.split(":")[0]);
    return startHour - 6;
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Slot Planner Calendar</h2>
        <span className="text-[12px] text-[#94A3B8] ml-2">{sampleSlots.length} slots</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Time header */}
          <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="w-[140px] flex-shrink-0 px-3 py-2 text-[12px] font-semibold text-[#64748B] border-r border-[#E2E8F0]">
              Resource
            </div>
            {timeSlots.map((t) => (
              <div key={t} className="flex-1 min-w-[60px] px-1 py-2 text-[11px] font-medium text-[#64748B] text-center border-r border-[#E2E8F0]">
                {t}
              </div>
            ))}
          </div>

          {/* Resource rows */}
          {resources.map((resource) => {
            const resourceSlots = sampleSlots.filter(s => s.bay === resource);
            const isHovered = hoveredResource === resource;
            return (
              <div
                key={resource}
                className="flex border-b border-[#E2E8F0] hover:bg-[#F8FAFC]/50 transition-colors"
                onMouseEnter={() => setHoveredResource(resource)}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className={`w-[140px] flex-shrink-0 px-3 py-3 border-r border-[#E2E8F0] flex items-center ${isHovered ? "bg-[#EBF0F7]" : ""}`}>
                  <span className="text-[12px] font-semibold text-[#0F172A]">{resource}</span>
                </div>
                <div className="flex flex-1 relative">
                  {timeSlots.map((time) => {
                    const slot = getSlotForCell(resource, time);
                    const isStartOfSlot = slot && time === slot.startTime;
                    const style = slot ? statusStyle[slot.status as SlotStatus] : statusStyle["Available"];
                    return (
                      <div
                        key={time}
                        className="flex-1 min-w-[60px] border-r border-[#E2E8F0] relative"
                        style={{ height: 56 }}
                      >
                        {isStartOfSlot && slot && (
                          <button
                            onClick={() => onSlotClick(slot)}
                            className="absolute inset-0.5 rounded-[8px] px-1.5 py-1 text-left cursor-pointer hover:shadow-md transition-all overflow-hidden"
                            style={{
                              backgroundColor: style.bg,
                              border: `1px solid ${style.border}`,
                              width: `${getSpanForSlot(slot) * 100 + (getSpanForSlot(slot) - 1)}%`,
                              zIndex: 10,
                            }}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={style.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={style.icon} />
                              </svg>
                              <span className="text-[10px] font-bold truncate" style={{ color: style.text }}>
                                {slot.status}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#0F172A] truncate block">{slot.awbNo}</span>
                            <span className="text-[9px] text-[#64748B] truncate block">{slot.vehicleNo}</span>
                            <span className="text-[9px] text-[#64748B] truncate block">{slot.cargoClass} · {slot.expectedPieces} pcs</span>
                            <span className="text-[9px] text-[#64748B] truncate block">{slot.assignedTeam}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-4 flex-wrap">
        <span className="text-[11px] font-medium text-[#64748B]">Legend:</span>
        {Object.entries(statusStyle).map(([status, style]) => (
          <span key={status} className="flex items-center gap-1 text-[11px] text-[#64748B]">
            <span className="w-3 h-3 rounded-[4px] border" style={{ backgroundColor: style.bg, borderColor: style.border }} />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}