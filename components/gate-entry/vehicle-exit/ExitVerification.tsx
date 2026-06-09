"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface ExitVerificationProps {
  items: {
    label: string;
    pass: boolean;
    detail: string;
  }[];
}

export default function ExitVerification({ items }: ExitVerificationProps) {
  const allPass = items.every((i) => i.pass);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm sticky top-4">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 size={20} className="text-[#1B4F8B]" />
        <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Exit Verification</h2>
        <span className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none text-white bg-[#16A34A]">inc.</span>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl border transition-colors"
            style={{
              borderColor: item.pass ? "#DCFCE7" : "#FEE2E2",
              backgroundColor: item.pass ? "#F0FDF4" : "#FEF2F2",
            }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: item.pass ? "#DCFCE7" : "#FEE2E2" }}
            >
              {item.pass ? (
                <CheckCircle2 size={16} className="text-[#16A34A]" />
              ) : (
                <XCircle size={16} className="text-[#DC2626]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#0F172A]">{item.label}</span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: item.pass ? "#DCFCE7" : "#FEE2E2",
                    color: item.pass ? "#16A34A" : "#DC2626",
                  }}
                >
                  {item.pass ? "PASS" : "FAIL"}
                </span>
              </div>
              <p className="text-[12px] text-[#64748B] mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl border p-4 text-center"
        style={{
          borderColor: allPass ? "#DCFCE7" : "#FEE2E2",
          backgroundColor: allPass ? "#F0FDF4" : "#FEF2F2",
        }}
      >
        <p className="text-[14px] font-bold" style={{ color: allPass ? "#16A34A" : "#DC2626" }}>
          {allPass ? "All checks passed — ready to release" : "Some checks failed — review required"}
        </p>
      </div>
    </div>
  );
}