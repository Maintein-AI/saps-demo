"use client";

import { useState } from "react";
import { Check, X, Clock, Ban, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Slot {
  id: string;
  bay: string;
  hour: string;
  status: "Available" | "Booked" | "Pending Approval" | "Completed" | "Blocked";
  awb?: string;
  do?: string;
}

const bays = [
  "Vehicle Bay 01",
  "Vehicle Bay 02",
  "Vehicle Bay 03",
  "Vehicle Bay 04",
  "Special Cargo Bay",
  "Cold-chain Bay",
];

const hours = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const slots: Slot[] = [
  { id: "S1", bay: "Vehicle Bay 01", hour: "06:00", status: "Completed", awb: "214-45678901", do: "DO-90871" },
  { id: "S2", bay: "Vehicle Bay 01", hour: "07:00", status: "Booked", awb: "117-55443321", do: "DO-90873" },
  { id: "S3", bay: "Vehicle Bay 01", hour: "08:00", status: "Available" },
  { id: "S4", bay: "Vehicle Bay 01", hour: "09:00", status: "Available" },
  { id: "S5", bay: "Vehicle Bay 01", hour: "10:00", status: "Pending Approval", awb: "074-88219033", do: "DO-90874" },
  { id: "S6", bay: "Vehicle Bay 01", hour: "11:00", status: "Available" },
  { id: "S7", bay: "Vehicle Bay 01", hour: "12:00", status: "Booked", awb: "157-90811223", do: "DO-90872" },
  { id: "S8", bay: "Vehicle Bay 01", hour: "13:00", status: "Available" },
  { id: "S9", bay: "Vehicle Bay 01", hour: "14:00", status: "Available" },
  { id: "S10", bay: "Vehicle Bay 01", hour: "15:00", status: "Blocked" },
  { id: "S11", bay: "Vehicle Bay 01", hour: "16:00", status: "Available" },
  { id: "S12", bay: "Vehicle Bay 01", hour: "17:00", status: "Booked", awb: "214-99887766", do: "DO-90877" },
  { id: "S13", bay: "Vehicle Bay 01", hour: "18:00", status: "Available" },
  { id: "S14", bay: "Vehicle Bay 01", hour: "19:00", status: "Available" },
  { id: "S15", bay: "Vehicle Bay 01", hour: "20:00", status: "Available" },
  { id: "S16", bay: "Vehicle Bay 01", hour: "21:00", status: "Available" },
  { id: "S17", bay: "Vehicle Bay 01", hour: "22:00", status: "Available" },
  { id: "S18", bay: "Vehicle Bay 01", hour: "23:00", status: "Available" },

  { id: "S19", bay: "Vehicle Bay 02", hour: "06:00", status: "Available" },
  { id: "S20", bay: "Vehicle Bay 02", hour: "07:00", status: "Available" },
  { id: "S21", bay: "Vehicle Bay 02", hour: "08:00", status: "Booked", awb: "117-98765432", do: "DO-90875" },
  { id: "S22", bay: "Vehicle Bay 02", hour: "09:00", status: "Available" },
  { id: "S23", bay: "Vehicle Bay 02", hour: "10:00", status: "Available" },
  { id: "S24", bay: "Vehicle Bay 02", hour: "11:00", status: "Pending Approval", awb: "074-55667788", do: "DO-90879" },
  { id: "S25", bay: "Vehicle Bay 02", hour: "12:00", status: "Available" },
  { id: "S26", bay: "Vehicle Bay 02", hour: "13:00", status: "Completed", awb: "214-44556677", do: "DO-90881" },
  { id: "S27", bay: "Vehicle Bay 02", hour: "14:00", status: "Available" },
  { id: "S28", bay: "Vehicle Bay 02", hour: "15:00", status: "Available" },
  { id: "S29", bay: "Vehicle Bay 02", hour: "16:00", status: "Booked", awb: "117-44556677", do: "DO-90878" },
  { id: "S30", bay: "Vehicle Bay 02", hour: "17:00", status: "Available" },
  { id: "S31", bay: "Vehicle Bay 02", hour: "18:00", status: "Available" },
  { id: "S32", bay: "Vehicle Bay 02", hour: "19:00", status: "Blocked" },
  { id: "S33", bay: "Vehicle Bay 02", hour: "20:00", status: "Available" },
  { id: "S34", bay: "Vehicle Bay 02", hour: "21:00", status: "Available" },
  { id: "S35", bay: "Vehicle Bay 02", hour: "22:00", status: "Available" },
  { id: "S36", bay: "Vehicle Bay 02", hour: "23:00", status: "Available" },

  { id: "S37", bay: "Vehicle Bay 03", hour: "06:00", status: "Available" },
  { id: "S38", bay: "Vehicle Bay 03", hour: "07:00", status: "Available" },
  { id: "S39", bay: "Vehicle Bay 03", hour: "08:00", status: "Available" },
  { id: "S40", bay: "Vehicle Bay 03", hour: "09:00", status: "Booked", awb: "214-99887766", do: "DO-90877" },
  { id: "S41", bay: "Vehicle Bay 03", hour: "10:00", status: "Available" },
  { id: "S42", bay: "Vehicle Bay 03", hour: "11:00", status: "Available" },
  { id: "S43", bay: "Vehicle Bay 03", hour: "12:00", status: "Available" },
  { id: "S44", bay: "Vehicle Bay 03", hour: "13:00", status: "Available" },
  { id: "S45", bay: "Vehicle Bay 03", hour: "14:00", status: "Pending Approval", awb: "157-11223344", do: "DO-90880" },
  { id: "S46", bay: "Vehicle Bay 03", hour: "15:00", status: "Available" },
  { id: "S47", bay: "Vehicle Bay 03", hour: "16:00", status: "Available" },
  { id: "S48", bay: "Vehicle Bay 03", hour: "17:00", status: "Available" },
  { id: "S49", bay: "Vehicle Bay 03", hour: "18:00", status: "Available" },
  { id: "S50", bay: "Vehicle Bay 03", hour: "19:00", status: "Available" },
  { id: "S51", bay: "Vehicle Bay 03", hour: "20:00", status: "Available" },
  { id: "S52", bay: "Vehicle Bay 03", hour: "21:00", status: "Available" },
  { id: "S53", bay: "Vehicle Bay 03", hour: "22:00", status: "Available" },
  { id: "S54", bay: "Vehicle Bay 03", hour: "23:00", status: "Available" },

  { id: "S55", bay: "Vehicle Bay 04", hour: "06:00", status: "Available" },
  { id: "S56", bay: "Vehicle Bay 04", hour: "07:00", status: "Available" },
  { id: "S57", bay: "Vehicle Bay 04", hour: "08:00", status: "Available" },
  { id: "S58", bay: "Vehicle Bay 04", hour: "09:00", status: "Available" },
  { id: "S59", bay: "Vehicle Bay 04", hour: "10:00", status: "Available" },
  { id: "S60", bay: "Vehicle Bay 04", hour: "11:00", status: "Available" },
  { id: "S61", bay: "Vehicle Bay 04", hour: "12:00", status: "Available" },
  { id: "S62", bay: "Vehicle Bay 04", hour: "13:00", status: "Available" },
  { id: "S63", bay: "Vehicle Bay 04", hour: "14:00", status: "Available" },
  { id: "S64", bay: "Vehicle Bay 04", hour: "15:00", status: "Available" },
  { id: "S65", bay: "Vehicle Bay 04", hour: "16:00", status: "Available" },
  { id: "S66", bay: "Vehicle Bay 04", hour: "17:00", status: "Available" },
  { id: "S67", bay: "Vehicle Bay 04", hour: "18:00", status: "Available" },
  { id: "S68", bay: "Vehicle Bay 04", hour: "19:00", status: "Available" },
  { id: "S69", bay: "Vehicle Bay 04", hour: "20:00", status: "Available" },
  { id: "S70", bay: "Vehicle Bay 04", hour: "21:00", status: "Available" },
  { id: "S71", bay: "Vehicle Bay 04", hour: "22:00", status: "Available" },
  { id: "S72", bay: "Vehicle Bay 04", hour: "23:00", status: "Available" },

  { id: "S73", bay: "Special Cargo Bay", hour: "06:00", status: "Available" },
  { id: "S74", bay: "Special Cargo Bay", hour: "07:00", status: "Available" },
  { id: "S75", bay: "Special Cargo Bay", hour: "08:00", status: "Available" },
  { id: "S76", bay: "Special Cargo Bay", hour: "09:00", status: "Available" },
  { id: "S77", bay: "Special Cargo Bay", hour: "10:00", status: "Available" },
  { id: "S78", bay: "Special Cargo Bay", hour: "11:00", status: "Available" },
  { id: "S79", bay: "Special Cargo Bay", hour: "12:00", status: "Available" },
  { id: "S80", bay: "Special Cargo Bay", hour: "13:00", status: "Available" },
  { id: "S81", bay: "Special Cargo Bay", hour: "14:00", status: "Available" },
  { id: "S82", bay: "Special Cargo Bay", hour: "15:00", status: "Available" },
  { id: "S83", bay: "Special Cargo Bay", hour: "16:00", status: "Available" },
  { id: "S84", bay: "Special Cargo Bay", hour: "17:00", status: "Available" },
  { id: "S85", bay: "Special Cargo Bay", hour: "18:00", status: "Available" },
  { id: "S86", bay: "Special Cargo Bay", hour: "19:00", status: "Available" },
  { id: "S87", bay: "Special Cargo Bay", hour: "20:00", status: "Available" },
  { id: "S88", bay: "Special Cargo Bay", hour: "21:00", status: "Available" },
  { id: "S89", bay: "Special Cargo Bay", hour: "22:00", status: "Available" },
  { id: "S90", bay: "Special Cargo Bay", hour: "23:00", status: "Available" },

  { id: "S91", bay: "Cold-chain Bay", hour: "06:00", status: "Available" },
  { id: "S92", bay: "Cold-chain Bay", hour: "07:00", status: "Available" },
  { id: "S93", bay: "Cold-chain Bay", hour: "08:00", status: "Available" },
  { id: "S94", bay: "Cold-chain Bay", hour: "09:00", status: "Available" },
  { id: "S95", bay: "Cold-chain Bay", hour: "10:00", status: "Available" },
  { id: "S96", bay: "Cold-chain Bay", hour: "11:00", status: "Available" },
  { id: "S97", bay: "Cold-chain Bay", hour: "12:00", status: "Available" },
  { id: "S98", bay: "Cold-chain Bay", hour: "13:00", status: "Available" },
  { id: "S99", bay: "Cold-chain Bay", hour: "14:00", status: "Available" },
  { id: "S100", bay: "Cold-chain Bay", hour: "15:00", status: "Available" },
  { id: "S101", bay: "Cold-chain Bay", hour: "16:00", status: "Available" },
  { id: "S102", bay: "Cold-chain Bay", hour: "17:00", status: "Available" },
  { id: "S103", bay: "Cold-chain Bay", hour: "18:00", status: "Available" },
  { id: "S104", bay: "Cold-chain Bay", hour: "19:00", status: "Available" },
  { id: "S105", bay: "Cold-chain Bay", hour: "20:00", status: "Available" },
  { id: "S106", bay: "Cold-chain Bay", hour: "21:00", status: "Available" },
  { id: "S107", bay: "Cold-chain Bay", hour: "22:00", status: "Available" },
  { id: "S108", bay: "Cold-chain Bay", hour: "23:00", status: "Available" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  Available: { bg: "#DCFCE7", text: "#16A34A", icon: <Check size={10} />, label: "Available" },
  Booked: { bg: "#DBEAFE", text: "#1D4ED8", icon: <CheckCircle2 size={10} />, label: "Booked" },
  "Pending Approval": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={10} />, label: "Pending" },
  Completed: { bg: "#F1F5F9", text: "#64748B", icon: <CheckCircle2 size={10} />, label: "Completed" },
  Blocked: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={10} />, label: "Blocked" },
};

interface BayCalendarProps {
  onBook: (bay: string, hour: string) => void;
}

export default function BayCalendar({ onBook }: BayCalendarProps) {
  const { addToast } = useToast();

  const getSlot = (bay: string, hour: string): Slot | undefined => {
    return slots.find((s) => s.bay === bay && s.hour === hour);
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Available") {
      onBook(slot.bay, slot.hour);
    } else if (slot.status === "Blocked") {
      addToast("This slot is blocked by Planner.", "error");
    } else {
      addToast(`Slot ${slot.status.toLowerCase()} — select an available slot.`, "error");
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Available Vehicle Bay Slots</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#64748B]">01 Jun 2026</span>
          <div className="flex items-center gap-2">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 h-4 px-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                  {cfg.icon}
                </span>
                <span className="text-[11px] text-[#64748B]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid" style={{ gridTemplateColumns: `140px repeat(${hours.length}, 1fr)` }}>
            <div className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] border-r border-[#E2E8F0]">
              Bay
            </div>
            {hours.map((h) => (
              <div key={h} className="py-2 px-1 text-[11px] font-semibold text-[#64748B] text-center border-b border-[#E2E8F0] border-r border-[#E2E8F0]">
                {h}
              </div>
            ))}

            {bays.map((bay) => (
              <div key={bay} className="contents">
                <div className="py-2 px-3 text-[12px] font-semibold text-[#0F172A] border-b border-[#F1F5F9] border-r border-[#E2E8F0] flex items-center">
                  {bay}
                </div>
                {hours.map((h) => {
                  const slot = getSlot(bay, h);
                  const sc = slot ? statusConfig[slot.status] : statusConfig.Available;
                  return (
                    <button
                      key={`${bay}-${h}`}
                      onClick={() => slot && handleSlotClick(slot)}
                      className="py-2 px-1 border-b border-[#F1F5F9] border-r border-[#E2E8F0] cursor-pointer transition-all hover:opacity-80 flex items-center justify-center"
                      style={{ backgroundColor: slot ? sc.bg : "#F8FAFC" }}
                      title={slot ? `${slot.status} — ${slot.awb ? `AWB ${slot.awb}` : ""}` : "Available"}
                    >
                      <span style={{ color: sc.text }}>
                        {slot ? sc.icon : <X size={10} className="text-[#E2E8F0]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}