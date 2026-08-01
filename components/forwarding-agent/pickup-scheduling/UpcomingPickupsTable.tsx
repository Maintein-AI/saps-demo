"use client";

import { useState } from "react";
import {
  Edit3,
  CalendarCheck,
  Ban,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  FileDown,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Pickup {
  id: string;
  awb: string;
  do: string;
  driver: string;
  vehicle: string;
  slotDateTime: string;
  bay: string;
  cargoPieces: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Completed" | "Cancelled";
}

const pickups: Pickup[] = [
  {
    id: "PU-2026-001",
    awb: "214-45678901",
    do: "DO-90871",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
    slotDateTime: "01 Jun 2026, 06:00",
    bay: "Vehicle Bay 01",
    cargoPieces: 42,
    status: "Completed",
  },
  {
    id: "PU-2026-002",
    awb: "117-55443321",
    do: "DO-90873",
    driver: "Imran Ali",
    vehicle: "BJU-7721",
    slotDateTime: "01 Jun 2026, 07:00",
    bay: "Vehicle Bay 01",
    cargoPieces: 24,
    status: "Approved",
  },
  {
    id: "PU-2026-003",
    awb: "117-98765432",
    do: "DO-90875",
    driver: "Kashif Khan",
    vehicle: "KHI-9934",
    slotDateTime: "01 Jun 2026, 08:00",
    bay: "Vehicle Bay 02",
    cargoPieces: 18,
    status: "Approved",
  },
  {
    id: "PU-2026-004",
    awb: "074-88219033",
    do: "DO-90874",
    driver: "Bilal Ahmed",
    vehicle: "LHE-2217",
    slotDateTime: "01 Jun 2026, 10:00",
    bay: "Vehicle Bay 01",
    cargoPieces: 36,
    status: "Pending Approval",
  },
  {
    id: "PU-2026-005",
    awb: "157-90811223",
    do: "DO-90872",
    driver: "Nadeem Hussain",
    vehicle: "KHI-9921",
    slotDateTime: "01 Jun 2026, 12:00",
    bay: "Vehicle Bay 01",
    cargoPieces: 55,
    status: "Approved",
  },
  {
    id: "PU-2026-006",
    awb: "214-99887766",
    do: "DO-90877",
    driver: "Rashid Mehmood",
    vehicle: "KHI-7788",
    slotDateTime: "01 Jun 2026, 09:00",
    bay: "Vehicle Bay 03",
    cargoPieces: 12,
    status: "Approved",
  },
  {
    id: "PU-2026-007",
    awb: "074-55667788",
    do: "DO-90879",
    driver: "Faisal Khan",
    vehicle: "KHI-3344",
    slotDateTime: "01 Jun 2026, 11:00",
    bay: "Vehicle Bay 02",
    cargoPieces: 8,
    status: "Pending Approval",
  },
  {
    id: "PU-2026-008",
    awb: "117-44556677",
    do: "DO-90878",
    driver: "Saad Qureshi",
    vehicle: "KHI-4455",
    slotDateTime: "01 Jun 2026, 16:00",
    bay: "Vehicle Bay 02",
    cargoPieces: 30,
    status: "Approved",
  },
  {
    id: "PU-2026-009",
    awb: "214-44556677",
    do: "DO-90881",
    driver: "Kamran Khan",
    vehicle: "BJU-5544",
    slotDateTime: "01 Jun 2026, 13:00",
    bay: "Vehicle Bay 02",
    cargoPieces: 15,
    status: "Completed",
  },
  {
    id: "PU-2026-010",
    awb: "157-11223344",
    do: "DO-90880",
    driver: "Javed Iqbal",
    vehicle: "KHI-1122",
    slotDateTime: "01 Jun 2026, 14:00",
    bay: "Vehicle Bay 03",
    cargoPieces: 6,
    status: "Draft",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  "Pending Approval": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
  Completed: { bg: "#DBEAFE", text: "#1D4ED8", icon: <CheckCircle size={12} /> },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

interface UpcomingPickupsTableProps {
  onEdit: (pickup: Pickup) => void;
  onViewGate: (pickup: Pickup) => void;
}

export default function UpcomingPickupsTable({ onEdit, onViewGate }: UpcomingPickupsTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Upcoming Pickups</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{pickups.length} pickups</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pickup ID</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Slot Date / Time</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Cargo Pieces</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((pickup) => {
              const sc = statusConfig[pickup.status];
              return (
                <tr key={pickup.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{pickup.id}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{pickup.awb}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{pickup.do}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{pickup.driver}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{pickup.vehicle}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{pickup.slotDateTime}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{pickup.cargoPieces}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {pickup.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(pickup)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onViewGate(pickup)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Gate Requirements"
                      >
                        <Shield size={14} />
                      </button>
                      <button
                        onClick={() => addToast("Booking confirmation downloaded.", "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Download Confirmation"
                      >
                        <FileDown size={14} />
                      </button>
                      <button
                        onClick={() => {} }
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Details"
                      >
                        <ArrowRight size={14} />
                      </button>
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