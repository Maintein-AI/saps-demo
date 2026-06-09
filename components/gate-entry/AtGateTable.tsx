"use client";

import { useState } from "react";
import { Shield, ArrowUpRight, Ban, Eye, CheckCircle2 } from "lucide-react";
import GateStatusBadge from "./GateStatusBadge";

const atGateData = [
  {
    vehicle: "KHI-4582",
    driver: "Ahmed Raza",
    cnic: "42101-1234567-1",
    purpose: "Cargo pickup",
    linked: "DO-90871",
    agent: "DB Schenker",
    entryStarted: "09:40",
    status: "Verification",
  },
  {
    vehicle: "BJU-7721",
    driver: "Imran Ali",
    cnic: "35202-1122334-4",
    purpose: "Cargo drop",
    linked: "AWB 214-45678901",
    agent: "Gerry's",
    entryStarted: "10:15",
    status: "Waiting",
  },
  {
    vehicle: "LEA-2099",
    driver: "Salman Khan",
    cnic: "42201-1987654-3",
    purpose: "Supplier",
    linked: "—",
    agent: "—",
    entryStarted: "10:35",
    status: "Hold",
  },
];

export default function AtGateTable() {
  const [expanded, setExpanded] = useState(false);
  const [actionOpen, setActionOpen] = useState<number | null>(null);
  const visibleData = expanded ? atGateData : atGateData.slice(0, 3);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-[#1B4F8B]" />
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
            At Gate / In Progress
          </h2>
          <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
            inc.
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Vehicle #</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Driver Name</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Driver CNIC</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Purpose</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Linked AWB / DO</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Forwarding Agent</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Entry Started</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Status</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3 w-[140px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-3 py-4 text-[14px] font-semibold text-[#0F172A]">{row.vehicle}</td>
                <td className="px-3 py-4 text-[13px] text-[#0F172A]">{row.driver}</td>
                <td className="px-3 py-4 text-[13px] text-[#64748B] font-mono">{row.cnic}</td>
                <td className="px-3 py-4 text-[13px] text-[#0F172A]">{row.purpose}</td>
                <td className="px-3 py-4 text-[13px] font-semibold text-[#1B4F8B]">{row.linked}</td>
                <td className="px-3 py-4 text-[13px] text-[#64748B]">{row.agent}</td>
                <td className="px-3 py-4 text-[13px] text-[#64748B]">{row.entryStarted}</td>
                <td className="px-3 py-4">
                  <GateStatusBadge status={row.status} />
                </td>
                <td className="px-3 py-4 relative">
                  <div className="flex items-center gap-1">
                    {row.status === "Verification" && (
                      <>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#DCFCE7] text-[#16A34A] hover:bg-[#16A34A]/20 cursor-pointer transition-colors" title="Cleared">
                          <CheckCircle2 size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706] hover:bg-[#D97706]/20 cursor-pointer transition-colors" title="Hold">
                          <Ban size={16} />
                        </button>
                      </>
                    )}
                    {row.status === "Waiting" && (
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706] hover:bg-[#D97706]/20 cursor-pointer transition-colors" title="Open Vehicle Entry">
                        <ArrowUpRight size={16} />
                      </button>
                    )}
                    {row.status === "Hold" && (
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FEE2E2] text-[#DC2626] hover:bg-[#DC2626]/20 cursor-pointer transition-colors" title="Reject">
                        <Ban size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setActionOpen(actionOpen === i ? null : i)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  {actionOpen === i && (
                    <div className="absolute right-2 top-14 z-10 w-[160px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                      <div className="flex flex-col py-1">
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">View Gate Pass</button>
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">Open Vehicle Entry</button>
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">Open Vehicle Exit</button>
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer">Hold for Verification</button>
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer">Reject</button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {atGateData.length > 3 && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-8 px-4 rounded-lg text-[13px] font-semibold text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
          >
            {expanded ? "Show Less" : `Show All (${atGateData.length})`}
          </button>
        </div>
      )}
    </div>
  );
}