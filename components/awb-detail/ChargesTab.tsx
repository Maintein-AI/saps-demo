"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { DollarSign, FileText, ArrowRight } from "lucide-react";
import CmtRentDrawer from "@/components/cold-rent/CmtRentDrawer";

const chargeItems = [
  { label: "Storage Rent", amount: "PKR 48,750", rate: "PKR 35 / 100kg / 24h", days: "4 days", badge: "inc" },
  { label: "Handling Fee", amount: "PKR 12,400", rate: "PKR 10 / 100kg", badge: "inc" },
  { label: "Breakdown Fee", amount: "PKR 3,600", rate: "PKR 150 / AWB", badge: "inc" },
  { label: "Customs Processing", amount: "PKR 2,500", rate: "Flat", badge: "inc" },
  { label: "Cold Chain Surcharge", amount: "PKR 0", rate: "N/A", badge: "inc" },
];

export default function ChargesTab() {
  const { addToast } = useToast();
  const [rentDrawerOpen, setRentDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Billing Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Operational Billing Summary
          </h3>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          <span>Charge Type</span>
          <span>Rate</span>
          <span>Basis</span>
          <span className="text-right">Amount</span>
        </div>
        {chargeItems.map((item, i) => (
          <div
            key={item.label}
            className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-[#E2E8F0] last:border-b-0 items-center"
            style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#0F172A]">{item.label}</span>
            </div>
            <span className="text-[13px] text-[#64748B]">{item.rate}</span>
            <span className="text-[13px] text-[#64748B]">{item.days || "—"}</span>
            <span className="text-[13px] font-semibold text-[#0F172A] text-right">{item.amount}</span>
          </div>
        ))}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <span className="text-[13px] font-bold text-[#0F172A] col-span-3">Total Charges</span>
          <span className="text-[13px] font-bold text-[#0B2545] text-right">PKR 67,250</span>
        </div>
      </div>

      {/* Godown Rent Engine Trigger */}
      <div className="rounded-[12px] border border-[#DC2626]/20 bg-[#DC2626]/5 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-[#DC2626]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-[14px] font-bold text-[#0F172A]">
                CMTS-grade Godown Rent Engine
              </h4>
            </div>
            <p className="text-[13px] text-[#64748B] leading-relaxed mb-3">
              Advanced rent calculation engine with CMTS (Cargo Management Terminal System) integration. Supports slab-based pricing, demurrage, and multi-warehouse rate cards. This module is outside the current awarded scope.
            </p>
            <button
              onClick={() => setRentDrawerOpen(true)}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer transition-colors"
            >
              <DollarSign size={14} />
              Open Rent Engine
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <CmtRentDrawer
        isOpen={rentDrawerOpen}
        onClose={() => setRentDrawerOpen(false)}
      />
    </div>
  );
}