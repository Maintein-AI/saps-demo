"use client";

import { useState } from "react";
import { Truck, Eye, ArrowRightLeft, Clock } from "lucide-react";
import GateStatusBadge from "./GateStatusBadge";

const insideData = [
  {
    vehicle: "KHI-3001",
    driver: "Nadeem Hussain",
    purpose: "Cargo pickup",
    linked: "DO-90865",
    entryTime: "08:15",
    dwellTime: "2h 24m",
    location: "Dock 04",
    status: "Active",
  },
  {
    vehicle: "RWP-7712",
    driver: "Farooq Ahmed",
    purpose: "Cargo drop",
    linked: "AWB 157-90811223",
    entryTime: "08:42",
    dwellTime: "1h 58m",
    location: "Dock 02",
    status: "Docking",
  },
  {
    vehicle: "LHE-9901",
    driver: "Tariq Mehmood",
    purpose: "Supplier",
    linked: "—",
    entryTime: "09:10",
    dwellTime: "1h 30m",
    location: "Yard B",
    status: "Active",
  },
  {
    vehicle: "FSB-1123",
    driver: "Kamran Ali",
    purpose: "Cargo pickup",
    linked: "DO-90872",
    entryTime: "09:35",
    dwellTime: "1h 05m",
    location: "Dock 05",
    status: "Exit",
  },
  {
    vehicle: "PSH-5544",
    driver: "Waseem Khan",
    purpose: "Cargo drop",
    linked: "AWB 074-88219033",
    entryTime: "10:05",
    dwellTime: "35m",
    location: "Dock 03",
    status: "Active",
  },
];

export default function InsidePremisesTable() {
  const [expanded, setExpanded] = useState(false);
  const [actionOpen, setActionOpen] = useState<number | null>(null);
  const visibleData = expanded ? insideData : insideData.slice(0, 3);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Truck size={20} className="text-[#1B4F8B]" />
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
            Inside Premises
          </h2>
          <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">
            inc.
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Vehicle #</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Driver</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Purpose</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Linked AWB / DO</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Entry Time</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Dwell Time</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Location</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3">Status</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] px-3 py-3 w-[80px]">Action</th>
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
                <td className="px-3 py-4 text-[13px] text-[#0F172A]">{row.purpose}</td>
                <td className="px-3 py-4 text-[13px] font-semibold text-[#1B4F8B]">{row.linked}</td>
                <td className="px-3 py-4 text-[13px] text-[#64748B]">{row.entryTime}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1.5 text-[13px] text-[#0F172A]">
                    <Clock size={13} className="text-[#94A3B8]" />
                    {row.dwellTime}
                  </div>
                </td>
                <td className="px-3 py-4 text-[13px] text-[#64748B]">{row.location}</td>
                <td className="px-3 py-4">
                  <GateStatusBadge status={row.status} />
                </td>
                <td className="px-3 py-4 relative">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1B4F8B] hover:bg-[#1B4F8B]/20 cursor-pointer transition-colors" title="Open Vehicle Exit">
                      <ArrowRightLeft size={16} />
                    </button>
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
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer">Open Vehicle Exit</button>
                        <button className="text-left px-3 py-2.5 text-[12px] text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer">Hold for Verification</button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {insideData.length > 3 && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-8 px-4 rounded-lg text-[13px] font-semibold text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
          >
            {expanded ? "Show Less" : `Show All (${insideData.length})`}
          </button>
        </div>
      )}
    </div>
  );
}