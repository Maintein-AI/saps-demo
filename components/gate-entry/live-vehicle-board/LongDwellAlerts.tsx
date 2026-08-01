"use client";

import { Clock, AlertTriangle, Phone, Eye, PauseCircle, LogOut, ArrowUpRight } from "lucide-react";
import GateStatusBadge from "@/components/gate-entry/GateStatusBadge";

const alerts = [
  {
    vehicle: "KHI-3001",
    driver: "Nadeem Hussain",
    entryTime: "07:30",
    dwellTime: "3h 12m",
    purpose: "Cargo pickup",
    doc: "DO-90865",
    alertReason: "Over 3 hours dwell",
    status: "Hold",
  },
  {
    vehicle: "RWP-5500",
    driver: "Asif Javed",
    entryTime: "06:15",
    dwellTime: "4h 27m",
    purpose: "Cargo drop",
    doc: "AWB 331-99887766",
    agent: "Kerry Logistics",
    alertReason: "Over 4 hours dwell",
    status: "Active",
  },
];

interface LongDwellAlertsProps {
  onAction: (action: string, vehicle: string) => void;
}

export default function LongDwellAlerts({ onAction }: LongDwellAlertsProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
          <AlertTriangle size={20} className="text-[#DC2626]" />
        </div>
        <h2 className="text-[18px] font-bold text-[#0F172A]">Long Dwell Alerts</h2>
        <span className="ml-auto text-[28px] font-bold text-[#DC2626]">{alerts.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              {["Vehicle #", "Driver", "Entry Time", "Dwell Time", "Purpose", "Linked AWB / DO", "Alert Reason", "Status", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0B2545] flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-bold text-[#0F172A]">{a.vehicle}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-[13px] text-[#0F172A]">{a.driver}</td>
                <td className="px-3 py-3 text-[13px] text-[#64748B]">{a.entryTime}</td>
                <td className="px-3 py-3">
                  <span className="text-[13px] font-bold text-[#DC2626]">{a.dwellTime}</span>
                </td>
                <td className="px-3 py-3 text-[13px] text-[#0F172A]">{a.purpose}</td>
                <td className="px-3 py-3 text-[13px] font-semibold text-[#0F172A]">{a.doc}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                    <Clock size={10} />
                    {a.alertReason}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <GateStatusBadge status={a.status} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onAction("view", a.vehicle)}
                      className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#1B4F8B] hover:bg-[#EBF0F7] cursor-pointer transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onAction("escalate", a.vehicle)}
                      className="w-8 h-8 rounded-lg border border-[#FEF3C7] flex items-center justify-center text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer transition-colors"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                    <button
                      onClick={() => onAction("call", a.vehicle)}
                      className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <Phone size={14} />
                    </button>
                    <button
                      onClick={() => onAction("release", a.vehicle)}
                      className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white hover:opacity-90 cursor-pointer transition-colors"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}