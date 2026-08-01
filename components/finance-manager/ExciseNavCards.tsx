"use client";
import { ArrowUpRight, Lock } from "lucide-react";

const excItems = [
  {
    title: "CMTS-grade Multi-Tariff Engine",
    description: "Advanced multi-tier tariff calculation with commodity-grade pricing models.",
    scope: "exc" as const,
  },
  {
    title: "Payment Gateway Reconciliation",
    description: "Real-time reconciliation with bank and card payment gateways.",
    scope: "exc" as const,
  },
  {
    title: "ERP Bridge",
    description: "Direct integration with SAP, Oracle, and other ERP systems.",
    scope: "exc" as const,
  },
];

export default function ExciseNavCards() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Future Modules</h2>
          <span className="text-[12px] text-[#64748B]">Not in current scope</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {excItems.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-[#94A3B8]">
                  <Lock size={14} />
                </div>
              </div>
              <h3 className="text-[13px] font-bold text-[#0F172A] mb-1">{item.title}</h3>
              <p className="text-[12px] text-[#64748B] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}