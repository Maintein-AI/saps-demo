"use client";

import { useState } from "react";
import { History, ArrowRight, CheckCircle2, AlertTriangle, XCircle, AlertCircle } from "lucide-react";

interface ScanEntry {
  id: string;
  time: string;
  rfid: string;
  pieceId: string;
  awb: string;
  result: string;
  location: string;
  operator: string;
}

const recentScans: ScanEntry[] = [
  {
    id: "1",
    time: "11:47",
    rfid: "EPC-3008-21445678901-0007",
    pieceId: "P-21445678901-07",
    awb: "214-45678901",
    result: "Matched",
    location: "Receiving Bay 02",
    operator: "FL-03",
  },
  {
    id: "2",
    time: "11:42",
    rfid: "EPC-3008-21445678901-0006",
    pieceId: "P-21445678901-06",
    awb: "214-45678901",
    result: "Matched",
    location: "Receiving Bay 02",
    operator: "FL-03",
  },
  {
    id: "3",
    time: "11:38",
    rfid: "EPC-3008-15790811223-0003",
    pieceId: "P-15790811223-03",
    awb: "157-90811223",
    result: "Matched",
    location: "Cold-COL-01",
    operator: "FL-02",
  },
  {
    id: "4",
    time: "11:35",
    rfid: "EPC-UNKNOWN-000000000000-0001",
    pieceId: "—",
    awb: "—",
    result: "Unknown",
    location: "Gate 3",
    operator: "FL-04",
  },
  {
    id: "5",
    time: "11:30",
    rfid: "EPC-3008-07488219033-0009",
    pieceId: "P-07488219033-09",
    awb: "074-88219033",
    result: "Matched",
    location: "GCR-R05-L2-B01",
    operator: "FL-03",
  },
  {
    id: "6",
    time: "11:25",
    rfid: "EPC-3008-15790811223-0002",
    pieceId: "P-15790811223-02",
    awb: "157-90811223",
    result: "Matched",
    location: "Cold-COL-01",
    operator: "FL-02",
  },
  {
    id: "7",
    time: "11:20",
    rfid: "EPC-3008-21445678901-0005",
    pieceId: "P-21445678901-05",
    awb: "214-45678901",
    result: "Matched",
    location: "Receiving Bay 02",
    operator: "FL-03",
  },
  {
    id: "8",
    time: "11:15",
    rfid: "EPC-3008-07488219033-0008",
    pieceId: "P-07488219033-08",
    awb: "074-88219033",
    result: "Matched",
    location: "GCR-R05-L2-B01",
    operator: "FL-03",
  },
];

const resultConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Matched: { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7", label: "Matched" },
  Unknown: { icon: AlertTriangle, color: "#DC2626", bg: "#FEE2E2", label: "Unknown" },
  Mismatch: { icon: XCircle, color: "#DC2626", bg: "#FEE2E2", label: "Mismatch" },
  Duplicate: { icon: AlertCircle, color: "#D97706", bg: "#FEF3C7", label: "Duplicate" },
};

export default function RecentScansTable() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? recentScans : recentScans.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Recent RFID Scans</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
          <History size={14} />
          <span>Last 8 scans</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">RFID EPC</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Piece ID</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">AWB #</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Result</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Operator</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((scan) => {
              const config = resultConfig[scan.result] || resultConfig.Matched;
              const Icon = config.icon;
              return (
                <tr key={scan.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A]">{scan.time}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-[#64748B] max-w-[160px] truncate">{scan.rfid}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A] hidden md:table-cell">{scan.pieceId}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0F172A] hidden lg:table-cell">{scan.awb}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      <Icon size={12} />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B] hidden md:table-cell">{scan.location}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#64748B] hidden lg:table-cell">{scan.operator}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!showAll && recentScans.length > 5 && (
        <div className="px-4 py-3 border-t border-[#E2E8F0] text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
          >
            Show all {recentScans.length} scans
          </button>
        </div>
      )}
    </div>
  );
}