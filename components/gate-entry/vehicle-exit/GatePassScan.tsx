"use client";

import { useState, useEffect } from "react";
import { ScanLine, X, Check, Camera, Upload } from "lucide-react";

interface GatePassScanProps {
  scanState: string;
  gatePass: string;
  onScan: (code: string) => void;
  onClear: () => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Check }> = {
  waiting: { label: "Waiting for Scan", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0", icon: ScanLine },
  found: { label: "Gate Pass Found", color: "#1B4F8B", bg: "#DBEAFE", border: "#2E75B6", icon: Check },
  mismatch: { label: "Mismatch", color: "#DC2626", bg: "#FEE2E2", border: "#DC2626", icon: X },
  hold: { label: "Hold", color: "#D97706", bg: "#FEF3C7", border: "#D97706", icon: X },
  cleared: { label: "Cleared for Exit", color: "#16A34A", bg: "#DCFCE7", border: "#16A34A", icon: Check },
};

export default function GatePassScan({ scanState, gatePass, onScan, onClear }: GatePassScanProps) {
  const [input, setInput] = useState(gatePass);

  const status = statusConfig[scanState] || statusConfig.waiting;
  const Icon = status.icon;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <ScanLine size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Gate Pass Scan</h2>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <ScanLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) onScan(input.trim().toUpperCase());
            }}
            placeholder="Scan Gate Pass barcode or RFID"
            className="w-full h-14 pl-12 pr-12 rounded-xl border-2 text-[16px] font-bold uppercase tracking-wider transition-colors outline-none"
            style={{
              borderColor: scanState === "waiting" ? "#E2E8F0" : status.border,
              backgroundColor: scanState === "waiting" ? "#F8FAFC" : status.bg,
              color: scanState === "waiting" ? "#0F172A" : status.color,
            }}
            autoComplete="off"
          />
          {input && (
            <button
              onClick={() => { setInput(""); onClear(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] cursor-pointer hover:bg-[#E2E8F0]"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="text-[12px] text-[#94A3B8] mt-2 ml-1">
          Scan Gate Pass barcode or RFID to verify exit clearance.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div
            className="flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            <Icon size={14} />
            {status.label}
          </div>
        </div>

        {scanState === "waiting" && (
          <button
            onClick={() => input.trim() && onScan(input.trim().toUpperCase())}
            className="w-full h-14 mt-6 rounded-xl text-[15px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#1B4F8B" }}
          >
            Simulate Scan
          </button>
        )}
      </div>
    </div>
  );
}