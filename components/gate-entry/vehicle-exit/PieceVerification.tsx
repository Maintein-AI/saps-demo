"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Piece {
  pieceId: string;
  rfid: string;
  expected: string;
  loaded: string;
  scanStatus: string;
  remarks: string;
}

interface PieceVerificationProps {
  pieces: Piece[];
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Matched: { color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle2 },
  Mismatch: { color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
  Pending: { color: "#D97706", bg: "#FEF3C7", icon: AlertTriangle },
};

export default function PieceVerification({ pieces }: PieceVerificationProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 mb-5">
        <CheckCircle2 size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Piece Verification</h2>
        <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">inc.</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              {["Piece ID", "RFID EPC", "Expected", "Loaded", "Scan Status", "Remarks"].map((h) => (
                <th key={h} className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pieces.map((p, i) => {
              const cfg = statusConfig[p.scanStatus] || statusConfig.Pending;
              const Icon = cfg.icon;
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-3 text-[13px] font-semibold text-[#0F172A]">{p.pieceId}</td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{p.rfid}</td>
                  <td className="px-3 py-3 text-[13px] text-[#0F172A]">{p.expected}</td>
                  <td className="px-3 py-3 text-[13px] text-[#0F172A]">{p.loaded}</td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      <Icon size={12} />
                      {p.scanStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#64748B]">{p.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}