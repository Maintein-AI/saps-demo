"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { DollarSign, CheckCircle, AlertCircle, MinusCircle, ArrowUpCircle, Clock } from "lucide-react";

interface KPIStripProps {
  data: {
    totalCollected: number;
    matched: number;
    unmatched: number;
    partial: number;
    exceptions: number;
    pendingSettlements: number;
  };
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const cards = [
  { key: "totalCollected" as const, label: "Total collected today", icon: DollarSign, color: "#0B2545" },
  { key: "matched" as const, label: "Matched invoices", icon: CheckCircle, color: "#16A34A" },
  { key: "unmatched" as const, label: "Unmatched payments", icon: AlertCircle, color: "#D97706" },
  { key: "partial" as const, label: "Partial payments", icon: MinusCircle, color: "#7C3AED" },
  { key: "exceptions" as const, label: "Settlement exceptions", icon: ArrowUpCircle, color: "#DC2626" },
  { key: "pendingSettlements" as const, label: "Pending bank settlements", icon: Clock, color: "#1B4F8B" },
] as const;

export default function KPIStrip({ data }: KPIStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.key === "totalCollected" ? formatPKR(data[card.key]) : data[card.key];
        return (
          <div key={card.key} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                {card.label}
              </span>
              <ScopeBadge type="inc" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <span className="text-[22px] font-bold" style={{ color: card.color }}>
                {value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}