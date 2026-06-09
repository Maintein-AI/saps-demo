"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { Clock, CheckCircle, XCircle, FileText, DollarSign } from "lucide-react";

interface KPIStripProps {
  data: {
    pending: number;
    approved: number;
    rejected: number;
    creditNotes: number;
    totalValue: number;
  };
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const cards = [
  { key: "pending", label: "Pending requests", icon: Clock, color: "#D97706" },
  { key: "approved", label: "Approved today", icon: CheckCircle, color: "#16A34A" },
  { key: "rejected", label: "Rejected today", icon: XCircle, color: "#DC2626" },
  { key: "creditNotes", label: "Credit notes created", icon: FileText, color: "#1B4F8B" },
  { key: "totalValue", label: "Total waiver value PKR", icon: DollarSign, color: "#0B2545" },
] as const;

export default function KPIStrip({ data }: KPIStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.key === "totalValue" ? formatPKR(data[card.key]) : data[card.key];
        return (
          <div
            key={card.key}
            className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                {card.label}
              </span>
              <ScopeBadge type="inc" />
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.color + "15" }}
              >
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <span className="text-[22px] font-bold text-[#0F172A]" style={{ color: card.color }}>
                {value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}