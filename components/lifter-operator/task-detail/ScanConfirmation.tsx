"use client";

import { Scan, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

interface ScanConfirmationProps {
  scanInput: string;
  setScanInput: (val: string) => void;
  scanStatus: string;
  onScan: () => void;
  expectedRfid: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; title: string; message: string; bg: string; border: string; text: string }> = {
  waiting: {
    icon: <Scan size={28} className="text-[#94A3B8]" />,
    title: "Waiting for Scan",
    message: "Scan the piece RFID tag to confirm identity.",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    text: "#64748B",
  },
  matched: {
    icon: <CheckCircle2 size={28} className="text-[#16A34A]" />,
    title: "Correct piece scanned.",
    message: "RFID matches assigned piece. Proceed to pick.",
    bg: "#DCFCE7",
    border: "#86EFAC",
    text: "#16A34A",
  },
  mismatch: {
    icon: <XCircle size={28} className="text-[#DC2626]" />,
    title: "RFID Mismatch",
    message: "Scanned RFID does not match assigned piece.",
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#DC2626",
  },
  duplicate: {
    icon: <AlertTriangle size={28} className="text-[#D97706]" />,
    title: "Duplicate Scan",
    message: "This piece has already been scanned.",
    bg: "#FEF3C7",
    border: "#FED7AA",
    text: "#D97706",
  },
  unknown: {
    icon: <HelpCircle size={28} className="text-[#64748B]" />,
    title: "Unknown RFID",
    message: "Scanned RFID is not recognized in the system.",
    bg: "#F1F5F9",
    border: "#E2E8F0",
    text: "#64748B",
  },
};

export default function ScanConfirmation({ scanInput, setScanInput, scanStatus, onScan, expectedRfid }: ScanConfirmationProps) {
  const config = statusConfig[scanStatus] || statusConfig.waiting;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Scan to Confirm</h3>
        <ScopeBadge type="inc" />
      </div>

      {/* Scan input */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Scan size={20} />
          </div>
          <input
            type="text"
            placeholder="Scan or enter RFID EPC..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onScan()}
            className="w-full h-14 rounded-xl text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] pl-12 pr-4 border outline-none transition-colors"
            style={{
              borderColor: scanStatus === "matched" ? "#86EFAC" : scanStatus === "mismatch" ? "#FECACA" : "#E2E8F0",
              backgroundColor: scanStatus === "matched" ? "#F0FDF4" : scanStatus === "mismatch" ? "#FEF2F2" : "#F8FAFC",
            }}
          />
        </div>
        <button
          onClick={onScan}
          className="h-14 px-5 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#0B2545" }}
        >
          Scan
        </button>
      </div>

      {/* Status indicator */}
      <div
        className="flex items-center gap-4 p-4 rounded-xl border"
        style={{ backgroundColor: config.bg, borderColor: config.border }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: config.bg }}>
          {config.icon}
        </div>
        <div>
          <p className="text-[15px] font-bold" style={{ color: config.text }}>
            {config.title}
          </p>
          <p className="text-[13px] font-medium mt-0.5" style={{ color: config.text }}>
            {config.message}
          </p>
        </div>
      </div>

      {/* Expected RFID hint */}
      <div className="mt-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
        <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1">Expected RFID</p>
        <p className="text-[13px] font-mono text-[#0F172A]">{expectedRfid}</p>
      </div>
    </div>
  );
}