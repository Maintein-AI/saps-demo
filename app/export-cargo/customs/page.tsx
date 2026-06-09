"use client";

import { useState } from "react";
import { ShieldCheck, FileText, AlertTriangle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

interface ExportGD {
  awb: string;
  gd: string;
  shipper: string;
  destination: string;
  status: "Filed" | "Under Review" | "Query" | "Cleared" | "Held";
  filedAt: string;
  cha: string;
}

const ROWS: ExportGD[] = [
  { awb: "EK-784521", gd: "EXP-GD-2026-08821", shipper: "Pak Textile Mills", destination: "LHR", status: "Cleared", filedAt: "31 May 09:12", cha: "Allied CHA" },
  { awb: "EK-784522", gd: "EXP-GD-2026-08825", shipper: "Atlas Foods", destination: "DXB", status: "Query", filedAt: "31 May 10:04", cha: "Karachi CHA" },
  { awb: "EK-784523", gd: "EXP-GD-2026-08831", shipper: "Hyperstar Retail", destination: "JFK", status: "Under Review", filedAt: "31 May 10:55", cha: "Premier CHA" },
  { awb: "EK-784524", gd: "EXP-GD-2026-08840", shipper: "Metro Industries", destination: "MAN", status: "Filed", filedAt: "31 May 11:32", cha: "Allied CHA" },
  { awb: "EK-784525", gd: "EXP-GD-2026-08855", shipper: "Atlas Pharma", destination: "FRA", status: "Held", filedAt: "31 May 12:14", cha: "Karachi CHA" },
];

const STATUS_STYLES: Record<ExportGD["status"], { bg: string; text: string }> = {
  "Filed": { bg: "#F1F5F9", text: "#64748B" },
  "Under Review": { bg: "#FFFBEB", text: "#D97706" },
  "Query": { bg: "#FEF2F2", text: "#DC2626" },
  "Cleared": { bg: "#ECFDF5", text: "#16A34A" },
  "Held": { bg: "#FEF2F2", text: "#DC2626" },
};

export default function ExportCustoms() {
  const [statusFilter, setStatusFilter] = useState<"all" | ExportGD["status"]>("all");
  const filtered = statusFilter === "all" ? ROWS : ROWS.filter((r) => r.status === statusFilter);

  const counts = {
    all: ROWS.length,
    Cleared: ROWS.filter((r) => r.status === "Cleared").length,
    Query: ROWS.filter((r) => r.status === "Query").length,
    Held: ROWS.filter((r) => r.status === "Held").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "Export Cargo", href: "/export-cargo" },
          { label: "Customs" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Export Customs
          </h1>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Customs export clearance — GD filing in PSW / WeBOC, channel routing, OOC issuance.
          Re-export coordination handled in tandem with CHA portal.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Filed today</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{counts.all}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#ECFDF5] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#16A34A] mb-1">Cleared</div>
          <div className="text-[24px] font-bold text-[#16A34A]">{counts.Cleared}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#FFFBEB] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#D97706] mb-1">Query open</div>
          <div className="text-[24px] font-bold text-[#D97706]">{counts.Query}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#FEF2F2] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#DC2626] mb-1">Held</div>
          <div className="text-[24px] font-bold text-[#DC2626]">{counts.Held}</div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "Filed", "Under Review", "Query", "Cleared", "Held"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? "bg-[#0B2545] text-white border-[#0B2545]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1B4F8B]"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">AWB</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Export GD</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Shipper</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Destination</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Status</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Filed at</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">CHA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const s = STATUS_STYLES[r.status];
                return (
                  <tr key={r.awb} className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"} hover:bg-[#F1F5F9] cursor-pointer transition-colors`}>
                    <td className="px-4 py-3 font-mono font-semibold text-[#0F172A]">{r.awb}</td>
                    <td className="px-4 py-3 font-mono text-[#475569]">{r.gd}</td>
                    <td className="px-4 py-3 text-[#1F2937]">{r.shipper}</td>
                    <td className="px-4 py-3 font-mono">{r.destination}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
                        {r.status === "Held" && <AlertTriangle size={11} className="mr-1" />}
                        {r.status === "Cleared" && <ShieldCheck size={11} className="mr-1" />}
                        {r.status === "Filed" && <FileText size={11} className="mr-1" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{r.filedAt}</td>
                    <td className="px-4 py-3 text-[#475569]">{r.cha}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
