"use client";

import { useState } from "react";
import { FileSpreadsheet, AlertTriangle, CheckCircle2, Search, Download } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

interface ReconRow {
  awb: string;
  hawb: string;
  manifestPieces: number;
  physicalPieces: number;
  manifestWeight: number;
  physicalWeight: number;
  status: "match" | "shortage" | "overage" | "wrong-weight";
  cdrRef?: string;
}

const ROWS: ReconRow[] = [
  { awb: "618-12345678", hawb: "HWB-2024-001", manifestPieces: 24, physicalPieces: 24, manifestWeight: 1840, physicalWeight: 1840, status: "match" },
  { awb: "618-12345679", hawb: "HWB-2024-002", manifestPieces: 18, physicalPieces: 16, manifestWeight: 940, physicalWeight: 820, status: "shortage", cdrRef: "CDR-2026-0089" },
  { awb: "618-12345680", hawb: "HWB-2024-003", manifestPieces: 32, physicalPieces: 32, manifestWeight: 2450, physicalWeight: 2510, status: "wrong-weight", cdrRef: "CDR-2026-0090" },
  { awb: "618-12345681", hawb: "HWB-2024-004", manifestPieces: 11, physicalPieces: 11, manifestWeight: 720, physicalWeight: 720, status: "match" },
  { awb: "618-12345682", hawb: "HWB-2024-005", manifestPieces: 8, physicalPieces: 9, manifestWeight: 510, physicalWeight: 580, status: "overage", cdrRef: "CDR-2026-0091" },
];

const STATUS_STYLES: Record<ReconRow["status"], { bg: string; text: string; label: string }> = {
  "match": { bg: "#ECFDF5", text: "#16A34A", label: "Match" },
  "shortage": { bg: "#FEF2F2", text: "#DC2626", label: "Shortage" },
  "overage": { bg: "#FFFBEB", text: "#D97706", label: "Overage" },
  "wrong-weight": { bg: "#FFFBEB", text: "#D97706", label: "Wrong weight" },
};

export default function ManifestReconciliation() {
  const [flightFilter, setFlightFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReconRow["status"]>("all");
  const filtered = ROWS.filter((r) =>
    (!flightFilter || r.awb.includes(flightFilter) || r.hawb.includes(flightFilter)) &&
    (statusFilter === "all" || r.status === statusFilter)
  );

  const totals = {
    total: ROWS.length,
    match: ROWS.filter((r) => r.status === "match").length,
    discrepant: ROWS.filter((r) => r.status !== "match").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "CMTS Absorption", href: "/cmts-absorption" },
          { label: "Manifest Reconciliation" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Manifest Reconciliation
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Physical-versus-manifest reconciliation against FFM / FWB / FHL messages.
          Discrepancies auto-route to CDR (see Warehouse → Exceptions Queue).
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">AWBs today</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{totals.total}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#ECFDF5] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#16A34A] mb-1">Match</div>
          <div className="text-[24px] font-bold text-[#16A34A]">{totals.match}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#FEF2F2] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#DC2626] mb-1">Discrepant</div>
          <div className="text-[24px] font-bold text-[#DC2626]">{totals.discrepant}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Linked CDRs</div>
          <div className="text-[24px] font-bold text-[#0F172A]">3</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={flightFilter}
            onChange={(e) => setFlightFilter(e.target.value)}
            placeholder="Search AWB or HAWB…"
            className="pl-9 pr-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B] w-64"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "match", "shortage", "overage", "wrong-weight"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === f
                  ? "bg-[#0B2545] text-white border-[#0B2545]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1B4F8B]"
              }`}
            >
              {f === "all" ? "All" : STATUS_STYLES[f as ReconRow["status"]].label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545]">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Reconciliation table */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">AWB</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">HAWB</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px] text-center">Manifest pcs</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px] text-center">Physical pcs</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px] text-right">Manifest wt</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px] text-right">Physical wt</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">Status</th>
                <th className="px-4 py-3 font-bold text-[11px] uppercase tracking-[0.8px]">CDR</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const s = STATUS_STYLES[r.status];
                return (
                  <tr key={r.hawb} className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"} hover:bg-[#F1F5F9] transition-colors`}>
                    <td className="px-4 py-3 font-mono text-[#0F172A] font-semibold">{r.awb}</td>
                    <td className="px-4 py-3 font-mono text-[#475569]">{r.hawb}</td>
                    <td className="px-4 py-3 text-center font-mono">{r.manifestPieces}</td>
                    <td className={`px-4 py-3 text-center font-mono ${r.physicalPieces !== r.manifestPieces ? "text-[#DC2626] font-bold" : ""}`}>{r.physicalPieces}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.manifestWeight.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-mono ${r.physicalWeight !== r.manifestWeight ? "text-[#D97706] font-bold" : ""}`}>{r.physicalWeight.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
                        {r.status === "match" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#1B4F8B] text-[12px]">{r.cdrRef || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CMTS source footer */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <FileSpreadsheet size={18} color="#64748B" className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">CMTS source tables</div>
            <code className="text-[12px] text-[#475569] font-mono">IMPORTMANIFIEST · IMPORTAWB · IMPORTAWBDETAIL · IMPORTAWBLOCATION</code>
          </div>
        </div>
      </div>
    </div>
  );
}
