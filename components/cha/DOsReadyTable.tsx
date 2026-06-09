"use client";

import { useState } from "react";
import {
  FileCheck,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  Eye,
  Download,
  CreditCard,
} from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";

interface DOItem {
  id: string;
  doNo: string;
  awb: string;
  consignee: string;
  driver: string;
  vehicle: string;
  collectionSlot: string;
  status: "Ready" | "Driver Assigned" | "Scheduled" | "Collected" | "Pending Payment";
}

const doItems: DOItem[] = [
  {
    id: "DO-001",
    doNo: "DO-90912",
    awb: "214-77890123",
    consignee: "Gerry's Dnata",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
    collectionSlot: "01 Jun 2026, 14:00",
    status: "Ready",
  },
  {
    id: "DO-002",
    doNo: "DO-90913",
    awb: "157-66778899",
    consignee: "DB Schenker Pakistan",
    driver: "Imran Ali",
    vehicle: "BJU-7721",
    collectionSlot: "01 Jun 2026, 15:00",
    status: "Driver Assigned",
  },
  {
    id: "DO-003",
    doNo: "DO-90914",
    awb: "074-55443322",
    consignee: "Kuehne+Nagel KHI",
    driver: "Kashif Khan",
    vehicle: "KHI-9934",
    collectionSlot: "01 Jun 2026, 16:00",
    status: "Scheduled",
  },
  {
    id: "DO-004",
    doNo: "DO-90915",
    awb: "117-99887766",
    consignee: "Agility Pakistan",
    driver: "Bilal Ahmed",
    vehicle: "LHE-2217",
    collectionSlot: "02 Jun 2026, 09:00",
    status: "Pending Payment",
  },
  {
    id: "DO-005",
    doNo: "DO-90916",
    awb: "214-11223344",
    consignee: "Pakistan Cargo Services",
    driver: "Nadeem Hussain",
    vehicle: "KHI-9921",
    collectionSlot: "02 Jun 2026, 10:00",
    status: "Ready",
  },
  {
    id: "DO-006",
    doNo: "DO-90917",
    awb: "074-44556677",
    consignee: "Gerry's Dnata",
    driver: "Rashid Mehmood",
    vehicle: "KHI-7788",
    collectionSlot: "02 Jun 2026, 11:00",
    status: "Collected",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Ready: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Driver Assigned": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Truck size={12} /> },
  Scheduled: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Collected: { bg: "#F1F5F9", text: "#64748B", icon: <FileCheck size={12} /> },
  "Pending Payment": { bg: "#FEE2E2", text: "#DC2626", icon: <Clock size={12} /> },
};

interface DOsReadyTableProps {
  onViewDetail: (item: DOItem) => void;
}

export default function DOsReadyTable({ onViewDetail }: DOsReadyTableProps) {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">DOs Ready for Collection</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{doItems.length} DOs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Collection Slot</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {doItems.map((item) => {
              const sc = statusConfig[item.status];
              return (
                <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.doNo}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{item.driver}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.vehicle}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.collectionSlot}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => addToast(`DO ${item.doNo} downloaded.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Download DO"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => addToast(`Payment gateway opened for ${item.doNo}.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Pay Invoice"
                      >
                        <CreditCard size={14} />
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