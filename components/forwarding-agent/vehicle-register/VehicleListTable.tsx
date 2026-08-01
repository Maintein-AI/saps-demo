"use client";

import { useState } from "react";
import {
  Truck,
  Shield,
  Ban,
  AlertTriangle,
  Clock,
  Edit3,
  History,
  CalendarCheck,
  Plus,
  ArrowRight,
  Lock,
  LockOpen,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  capacity: string;
  photo: string;
  owner: string;
  insuranceExpiry: string;
  lastVisit: string;
  status: "Active" | "Blocked" | "Insurance Expired" | "Verification Required";
  notes: string;
}

const vehicles: Vehicle[] = [
  {
    id: "VEH001",
    plate: "KHI-4582",
    type: "Truck",
    capacity: "3.5 T",
    photo: "",
    owner: "Ahmed Raza",
    insuranceExpiry: "15 Aug 2026",
    lastVisit: "01 Jun 2026",
    status: "Active",
    notes: "Primary cargo vehicle, cold-chain capable",
  },
  {
    id: "VEH002",
    plate: "BJU-7721",
    type: "Pickup",
    capacity: "1.5 T",
    photo: "",
    owner: "Imran Ali",
    insuranceExpiry: "10 Jul 2026",
    lastVisit: "31 May 2026",
    status: "Active",
    notes: "Light cargo, city deliveries",
  },
  {
    id: "VEH003",
    plate: "KHI-9934",
    type: "Container",
    capacity: "20 FT",
    photo: "",
    owner: "Kashif Khan",
    insuranceExpiry: "12 Jun 2026",
    lastVisit: "30 May 2026",
    status: "Active",
    notes: "Container transport for heavy cargo",
  },
  {
    id: "VEH004",
    plate: "LHE-2217",
    type: "Truck",
    capacity: "5 T",
    photo: "",
    owner: "Bilal Ahmed",
    insuranceExpiry: "22 Sep 2026",
    lastVisit: "28 May 2026",
    status: "Active",
    notes: "DGR approved cargo truck",
  },
  {
    id: "VEH005",
    plate: "KHI-4455",
    type: "Van",
    capacity: "1.2 T",
    photo: "",
    owner: "Saad Qureshi",
    insuranceExpiry: "05 May 2026",
    lastVisit: "15 May 2026",
    status: "Insurance Expired",
    notes: "Insurance expired, renewal in process",
  },
  {
    id: "VEH006",
    plate: "KHI-9921",
    type: "Truck",
    capacity: "4 T",
    photo: "",
    owner: "Nadeem Hussain",
    insuranceExpiry: "18 Nov 2026",
    lastVisit: "29 May 2026",
    status: "Active",
    notes: "Kuehne+Nagel dedicated vehicle",
  },
  {
    id: "VEH007",
    plate: "BJU-5544",
    type: "Pickup",
    capacity: "1.0 T",
    photo: "",
    owner: "Kamran Khan",
    insuranceExpiry: "20 Oct 2026",
    lastVisit: "27 May 2026",
    status: "Blocked",
    notes: "Blocked due to expired fitness certificate",
  },
  {
    id: "VEH008",
    plate: "KHI-3344",
    type: "Car",
    capacity: "0.5 T",
    photo: "",
    owner: "Nadeem Hussain",
    insuranceExpiry: "30 Dec 2026",
    lastVisit: "26 May 2026",
    status: "Active",
    notes: "Small parcel delivery",
  },
  {
    id: "VEH009",
    plate: "KHI-7788",
    type: "Container",
    capacity: "40 FT",
    photo: "",
    owner: "Faisal Khan",
    insuranceExpiry: "14 Jan 2027",
    lastVisit: "25 May 2026",
    status: "Active",
    notes: "Large volume container transport",
  },
  {
    id: "VEH010",
    plate: "KHI-1122",
    type: "Bike",
    capacity: "0.1 T",
    photo: "",
    owner: "Javed Iqbal",
    insuranceExpiry: "08 Jun 2026",
    lastVisit: "24 May 2026",
    status: "Verification Required",
    notes: "Document verification pending",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A", icon: <Shield size={12} /> },
  Blocked: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
  "Insurance Expired": { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
  "Verification Required": { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
};

interface VehicleListTableProps {
  onEdit: (vehicle: Vehicle) => void;
  onViewHistory: (vehicle: Vehicle) => void;
  onAssign: (vehicle: Vehicle) => void;
  onAdd: () => void;
}

export default function VehicleListTable({
  onEdit,
  onViewHistory,
  onAssign,
  onAdd,
}: VehicleListTableProps) {
  const { addToast } = useToast();

  const handleBlock = (vehicle: Vehicle) => {
    addToast(`${vehicle.plate} blocked.`, "success");
  };

  const handleUnblock = (vehicle: Vehicle) => {
    addToast(`${vehicle.plate} unblocked.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Vehicle List</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{vehicles.length} vehicles</span>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add Vehicle</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Plate #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Capacity</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Photo</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Insurance Expiry</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Last Visit</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => {
              const sc = statusConfig[vehicle.status];
              return (
                <tr key={vehicle.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                        <Truck size={14} className="text-[#1B4F8B]" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#0F172A] font-mono">{vehicle.plate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{vehicle.type}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{vehicle.capacity}</td>
                  <td className="py-3 px-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                      <Truck size={14} className="text-[#94A3B8]" />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{vehicle.owner}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{vehicle.insuranceExpiry}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{vehicle.lastVisit}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onViewHistory(vehicle)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Visit History"
                      >
                        <History size={14} />
                      </button>
                      <button
                        onClick={() => onAssign(vehicle)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Assign to Pickup"
                      >
                        <CalendarCheck size={14} />
                      </button>
                      {vehicle.status === "Active" ? (
                        <button
                          onClick={() => handleBlock(vehicle)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                          title="Block"
                        >
                          <Lock size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(vehicle)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DCFCE7] text-[#16A34A] cursor-pointer transition-colors"
                          title="Unblock"
                        >
                          <LockOpen size={14} />
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