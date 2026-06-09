"use client";

import { CheckCircle2, Ban, Clock } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface Visit {
  date: string;
  vehicle: string;
  purpose: string;
  doc: string;
  entryTime: string;
  exitTime: string;
  result: string;
  guard: string;
}

const resultConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Cleared: { color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle2 },
  Hold: { color: "#D97706", bg: "#FEF3C7", icon: Clock },
  Rejected: { color: "#DC2626", bg: "#FEE2E2", icon: Ban },
};

interface VisitHistoryTableProps {
  visits: Visit[];
}

export default function VisitHistoryTable({ visits }: VisitHistoryTableProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              {["Date", "Vehicle #", "Purpose", "AWB / DO", "Entry Time", "Exit Time", "Result", "Gate Guard"].map((h) => (
                <th key={h} className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visits.map((v, i) => {
              const cfg = resultConfig[v.result] || resultConfig.Cleared;
              const Icon = cfg.icon;
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-3 text-[13px] font-semibold text-[#0F172A]">{v.date}</td>
                  <td className="px-3 py-3 text-[13px] font-bold text-[#0F172A]">{v.vehicle}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{v.purpose}</td>
                  <td className="px-3 py-3 text-[13px] font-semibold text-[#0F172A]">{v.doc}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{v.entryTime}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{v.exitTime}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      <Icon size={12} />
                      {v.result}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{v.guard}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}