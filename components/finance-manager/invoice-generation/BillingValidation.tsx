"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { CheckCircle, XCircle } from "lucide-react";

interface BillingValidationProps {
  checks: {
    awbExists: boolean;
    doExists: boolean;
    tariffActive: boolean;
    weightAvailable: boolean;
    storageDays: boolean;
    noDuplicate: boolean;
    waiverChecked: boolean;
    taxApplied: boolean;
  };
  passed: number;
  total: number;
}

const checkList = [
  { key: "awbExists" as const, label: "AWB exists" },
  { key: "doExists" as const, label: "DO exists if selected" },
  { key: "tariffActive" as const, label: "Tariff version active" },
  { key: "weightAvailable" as const, label: "Chargeable weight available" },
  { key: "storageDays" as const, label: "Storage days computed" },
  { key: "noDuplicate" as const, label: "No duplicate invoice" },
  { key: "waiverChecked" as const, label: "Waiver status checked" },
  { key: "taxApplied" as const, label: "Tax applied" },
];

export default function BillingValidation({ checks, passed, total }: BillingValidationProps) {
  const pct = Math.round((passed / total) * 100);
  const isReady = passed >= total - 1;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Billing Validation</h2>
          <ScopeBadge type="inc" />
        </div>
      </div>
      <div className="p-5">
        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#0F172A]">Readiness</span>
            <span className="text-[13px] font-bold text-[#0F172A]">{passed} / {total}</span>
          </div>
          <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: isReady ? "#16A34A" : "#D97706",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#94A3B8]">{pct}% complete</span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: isReady ? "#16A34A" : "#D97706" }}
            >
              {isReady ? "Ready to generate" : "Incomplete checks"}
            </span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {checkList.map((c) => {
            const isPass = checks[c.key];
            return (
              <div key={c.key} className="flex items-center gap-3 p-2.5 rounded-lg">
                <div className="flex-shrink-0">
                  {isPass ? (
                    <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <CheckCircle size={12} className="text-[#16A34A]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                      <XCircle size={12} className="text-[#94A3B8]" />
                    </div>
                  )}
                </div>
                <span
                  className="text-[13px]"
                  style={{
                    color: isPass ? "#0F172A" : "#94A3B8",
                    textDecoration: isPass ? "none" : "line-through",
                    textDecorationColor: "#CBD5E1",
                  }}
                >
                  {c.label}
                </span>
                <span
                  className="ml-auto text-[11px] font-semibold"
                  style={{ color: isPass ? "#16A34A" : "#94A3B8" }}
                >
                  {isPass ? "PASS" : "PENDING"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}