"use client";
import { ReconciliationException } from "@/components/finance-manager/payment-reconciliation/types";
import { AlertTriangle, XCircle, Copy, MinusCircle, ArrowUpCircle, Ban } from "lucide-react";

interface ExceptionSummaryProps {
  exceptions: ReconciliationException[];
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const exceptionConfig: Record<string, { icon: any; color: string; bg: string }> = {
  "Amount mismatch": { icon: AlertTriangle, color: "#D97706", bg: "#FEF3C7" },
  "Invoice not found": { icon: XCircle, color: "#DC2626", bg: "#FEE2E2" },
  "Duplicate payment": { icon: Copy, color: "#64748B", bg: "#F1F5F9" },
  "Partial payment": { icon: MinusCircle, color: "#7C3AED", bg: "#F3E8FF" },
  "Excess payment": { icon: ArrowUpCircle, color: "#1B4F8B", bg: "#DBEAFE" },
  "Failed settlement": { icon: Ban, color: "#DC2626", bg: "#FEE2E2" },
};

export default function ExceptionSummary({ exceptions }: ExceptionSummaryProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Reconciliation Exceptions</h2>
          <span className="text-[12px] text-[#64748B] ml-1">
            {exceptions.reduce((s, e) => s + e.count, 0)} exceptions
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {exceptions.map((ex) => {
            const config = exceptionConfig[ex.type] || exceptionConfig["Amount mismatch"];
            const Icon = config.icon;
            return (
              <div key={ex.type} className="rounded-xl border border-[#E2E8F0] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon size={16} style={{ color: config.color }} />
                  </div>
                  <span className="text-[12px] font-semibold text-[#0F172A] leading-tight">{ex.type}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[22px] font-bold text-[#0F172A]">{ex.count}</span>
                  <span className="text-[12px] text-[#64748B]">{ex.count === 1 ? "case" : "cases"}</span>
                </div>
                {ex.totalAmount > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[12px] font-semibold text-[#0F172A]">{formatPKR(ex.totalAmount)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}