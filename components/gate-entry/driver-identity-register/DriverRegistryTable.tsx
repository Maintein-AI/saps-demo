"use client";

import { Pencil, Ban, Clock, History } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface Driver {
  name: string;
  cnic: string;
  mobile: string;
  license: string;
  licenseExpiry: string;
  agents: string;
  awbs: string;
  lastVisit: string;
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#DCFCE7", text: "#16A34A" },
  Blocked: { bg: "#FEE2E2", text: "#DC2626" },
  "Expired License": { bg: "#FEF3C7", text: "#D97706" },
  "Verification Required": { bg: "#DBEAFE", text: "#1B4F8B" },
};

interface DriverRegistryTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onBlock: (driver: Driver) => void;
  onViewHistory: (driver: Driver) => void;
}

export default function DriverRegistryTable({ drivers, onEdit, onBlock, onViewHistory }: DriverRegistryTableProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              {["Driver Name", "CNIC", "Mobile", "License #", "License Expiry", "Allowed Agents", "Allowed AWBs / DOs", "Last Visit", "Status", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => {
              const cfg = statusConfig[d.status] || { bg: "#F1F5F9", text: "#64748B" };
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B2545] flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] font-bold text-white">{d.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#0F172A]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13px] font-mono text-[#64748B]">{d.cnic}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{d.mobile}</td>
                  <td className="px-3 py-3 text-[13px] font-mono text-[#0F172A]">{d.license}</td>
                  <td className="px-3 py-3 text-[13px] text-[#0F172A]">{d.licenseExpiry}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{d.agents}</td>
                  <td className="px-3 py-3 text-[13px] font-semibold text-[#0F172A]">{d.awbs}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{d.lastVisit}</td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: cfg.bg, color: cfg.text }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onEdit(d)}
                        className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onBlock(d)}
                        className="w-8 h-8 rounded-lg border border-[#FEE2E2] flex items-center justify-center text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer transition-colors"
                        title="Block"
                      >
                        <Ban size={14} />
                      </button>
                      <button
                        onClick={() => onViewHistory(d)}
                        className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        title="Visit History"
                      >
                        <History size={14} />
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