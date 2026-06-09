"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle2, XCircle, Clock, Printer, RotateCcw, Forklift, CheckCircle, AlertTriangle } from "lucide-react";

interface VerificationProps {
  checks: {
    gatePassValid: boolean;
    doIssued: boolean;
    paymentCleared: boolean;
    vehicleInside: boolean;
    driverVerified: boolean;
    piecesMatch: boolean;
    noCustomsHold: boolean;
    noDamageCDR: boolean;
  };
  onCheckChange: (key: string) => void;
  onConfirm: () => void;
  onHold: (pieceId: string) => void;
  onRescan: () => void;
  onAssign: () => void;
}

const checklistItems = [
  { key: "gatePassValid", label: "Gate Pass valid" },
  { key: "doIssued", label: "DO issued" },
  { key: "paymentCleared", label: "Payment cleared" },
  { key: "vehicleInside", label: "Vehicle inside premises" },
  { key: "driverVerified", label: "Driver verified" },
  { key: "piecesMatch", label: "Pieces match expected count" },
  { key: "noCustomsHold", label: "No active customs hold" },
  { key: "noDamageCDR", label: "No unresolved damage CDR" },
];

export default function VerificationPanel({
  checks,
  onCheckChange,
  onConfirm,
  onRescan,
  onAssign,
}: VerificationProps) {
  const allChecked = Object.values(checks).every(Boolean);
  const checkedCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Verification Checklist */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-[#0F172A]">Picking Verification</h2>
            <ScopeBadge type="inc" />
          </div>
          <span className="text-[12px] font-semibold text-[#64748B]">
            {checkedCount}/8
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {checklistItems.map((item) => {
            const isChecked = checks[item.key as keyof typeof checks];
            return (
              <button
                key={item.key}
                onClick={() => onCheckChange(item.key)}
                className="flex items-center gap-3 h-10 px-3 rounded-lg border text-left transition-all cursor-pointer w-full"
                style={{
                  backgroundColor: isChecked ? "#F0FDF4" : "white",
                  borderColor: isChecked ? "#16A34A" : "#E2E8F0",
                }}
              >
                {isChecked ? (
                  <CheckCircle2 size={16} className="text-[#16A34A]" />
                ) : (
                  <XCircle size={16} className="text-[#94A3B8]" />
                )}
                <span
                  className="text-[13px] font-medium flex-1"
                  style={{ color: isChecked ? "#0F172A" : "#64748B" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Completion bar */}
        <div className="mt-4">
          <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(checkedCount / 8) * 100}%`,
                backgroundColor: allChecked ? "#16A34A" : "#1B4F8B",
              }}
            />
          </div>
          <p className="text-[12px] text-[#64748B] mt-2 text-center">
            {allChecked ? "All checks complete - ready to confirm" : `${8 - checkedCount} checks remaining`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Actions</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            <CheckCircle size={16} />
            Confirm Pick Completion
          </button>
          <button
            onClick={() => onRescan()}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer transition-colors whitespace-nowrap"
          >
            <AlertTriangle size={16} />
            Hold Mismatch
          </button>
          <button
            onClick={onRescan}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <RotateCcw size={16} />
            Re-scan
          </button>
          <button
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Printer size={16} />
            Print Pick Sheet
          </button>
          <button
            onClick={onAssign}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Forklift size={16} />
            Assign to Lifter Operator
          </button>
        </div>
      </div>
    </div>
  );
}