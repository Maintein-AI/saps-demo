"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Ban,
  AlertTriangle,
  Clock,
  Edit3,
  History,
  FileCheck,
  Plus,
  ArrowRight,
  UserX,
  UserCheck,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface Driver {
  id: string;
  name: string;
  cnic: string;
  mobile: string;
  photo: string;
  license: string;
  licenseExpiry: string;
  allowedAWBs: string[];
  allowedDOs: string[];
  lastVisit: string;
  status: "Active" | "Blocked" | "License Expired" | "Verification Required";
  notes: string;
}

const drivers: Driver[] = [
  {
    id: "DRV001",
    name: "Ahmed Raza",
    cnic: "42101-1234567-1",
    mobile: "0301-2345678",
    photo: "",
    license: "LHE-2025-8891",
    licenseExpiry: "15 Aug 2026",
    allowedAWBs: ["214-45678901", "157-90811223"],
    allowedDOs: ["DO-90871", "DO-90872"],
    lastVisit: "01 Jun 2026",
    status: "Active",
    notes: "Reliable cold-chain driver",
  },
  {
    id: "DRV002",
    name: "Imran Ali",
    cnic: "35201-2345678-3",
    mobile: "0321-8765432",
    photo: "",
    license: "KHI-2024-1122",
    licenseExpiry: "10 Jul 2026",
    allowedAWBs: ["074-88219033", "117-55443321"],
    allowedDOs: ["DO-90873", "DO-90874"],
    lastVisit: "31 May 2026",
    status: "Active",
    notes: "Regular DB Schenker driver",
  },
  {
    id: "DRV003",
    name: "Kashif Khan",
    cnic: "42101-3456789-5",
    mobile: "0300-1122334",
    photo: "",
    license: "KHI-2023-4455",
    licenseExpiry: "12 Jun 2026",
    allowedAWBs: ["117-98765432"],
    allowedDOs: ["DO-90875"],
    lastVisit: "30 May 2026",
    status: "Active",
    notes: "New hire, under probation",
  },
  {
    id: "DRV004",
    name: "Bilal Ahmed",
    cnic: "36401-4567890-7",
    mobile: "0345-5566778",
    photo: "",
    license: "BJU-2025-6677",
    licenseExpiry: "22 Sep 2026",
    allowedAWBs: ["214-99887766", "117-44556677"],
    allowedDOs: ["DO-90877", "DO-90878"],
    lastVisit: "28 May 2026",
    status: "Active",
    notes: "Experienced DGR cargo handler",
  },
  {
    id: "DRV005",
    name: "Saad Qureshi",
    cnic: "42101-5678901-9",
    mobile: "0312-3344556",
    photo: "",
    license: "KHI-2024-2233",
    licenseExpiry: "05 May 2026",
    allowedAWBs: ["074-55667788", "157-11223344"],
    allowedDOs: ["DO-90879", "DO-90880"],
    lastVisit: "15 May 2026",
    status: "License Expired",
    notes: "License expired, renewal submitted",
  },
  {
    id: "DRV006",
    name: "Nadeem Hussain",
    cnic: "35201-6789012-1",
    mobile: "0333-7788990",
    photo: "",
    license: "KHI-2025-9900",
    licenseExpiry: "18 Nov 2026",
    allowedAWBs: ["214-44556677"],
    allowedDOs: ["DO-90881"],
    lastVisit: "29 May 2026",
    status: "Active",
    notes: "Kuehne+Nagel regular",
  },
  {
    id: "DRV007",
    name: "Kamran Khan",
    cnic: "42101-7890123-3",
    mobile: "0302-4455667",
    photo: "",
    license: "KHI-2024-3344",
    licenseExpiry: "20 Oct 2026",
    allowedAWBs: ["074-11223344"],
    allowedDOs: ["DO-90876"],
    lastVisit: "27 May 2026",
    status: "Blocked",
    notes: "Blocked due to security violation",
  },
  {
    id: "DRV008",
    name: "Rashid Mehmood",
    cnic: "36401-8901234-5",
    mobile: "0322-9900112",
    photo: "",
    license: "BJU-2025-1133",
    licenseExpiry: "30 Dec 2026",
    allowedAWBs: ["214-99887766"],
    allowedDOs: ["DO-90877"],
    lastVisit: "26 May 2026",
    status: "Active",
    notes: "Long-haul specialist",
  },
  {
    id: "DRV009",
    name: "Faisal Khan",
    cnic: "42101-9012345-7",
    mobile: "0314-2233445",
    photo: "",
    license: "KHI-2025-5566",
    licenseExpiry: "14 Jan 2027",
    allowedAWBs: ["117-44556677"],
    allowedDOs: ["DO-90878"],
    lastVisit: "25 May 2026",
    status: "Active",
    notes: "Gerry's Dnata partner",
  },
  {
    id: "DRV010",
    name: "Javed Iqbal",
    cnic: "35201-0123456-9",
    mobile: "0344-6677889",
    photo: "",
    license: "KHI-2024-7788",
    licenseExpiry: "08 Jun 2026",
    allowedAWBs: ["074-55667788"],
    allowedDOs: ["DO-90879"],
    lastVisit: "24 May 2026",
    status: "Verification Required",
    notes: "CNIC verification pending",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A", icon: <Shield size={12} /> },
  Blocked: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
  "License Expired": { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
  "Verification Required": { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
};

interface DriverListTableProps {
  onEdit: (driver: Driver) => void;
  onViewHistory: (driver: Driver) => void;
  onAssign: (driver: Driver) => void;
  onAdd: () => void;
}

export default function DriverListTable({
  onEdit,
  onViewHistory,
  onAssign,
  onAdd,
}: DriverListTableProps) {
  const { addToast } = useToast();

  const handleBlock = (driver: Driver) => {
    addToast(`${driver.name} blocked.`, "success");
  };

  const handleUnblock = (driver: Driver) => {
    addToast(`${driver.name} unblocked.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Driver List</h3>
          <ScopeBadge type="exc" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{drivers.length} drivers</span>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add Driver</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">CNIC</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Mobile</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Photo</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">License #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">License Expiry</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Allowed AWBs / DOs</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Last Visit</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              const sc = statusConfig[driver.status];
              return (
                <tr key={driver.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EBF0F7] flex items-center justify-center">
                        <User size={14} className="text-[#1B4F8B]" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#0F172A]">{driver.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] font-mono">{driver.cnic}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{driver.mobile}</td>
                  <td className="py-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                      <User size={14} className="text-[#94A3B8]" />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#0F172A]">{driver.license}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{driver.licenseExpiry}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-[#1B4F8B] font-semibold">{driver.allowedAWBs.join(", ")}</span>
                      <span className="text-[11px] text-[#64748B]">{driver.allowedDOs.join(", ")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{driver.lastVisit}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {driver.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(driver)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onViewHistory(driver)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Visit History"
                      >
                        <History size={14} />
                      </button>
                      <button
                        onClick={() => onAssign(driver)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Assign AWB/DO"
                      >
                        <FileCheck size={14} />
                      </button>
                      {driver.status === "Active" ? (
                        <button
                          onClick={() => handleBlock(driver)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                          title="Block"
                        >
                          <UserX size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(driver)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DCFCE7] text-[#16A34A] cursor-pointer transition-colors"
                          title="Unblock"
                        >
                          <UserCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => {}}
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