"use client";
import { FileCheck, Pencil, Archive, Layers, TrendingUp } from "lucide-react";

interface KPIStripProps {
  data: {
    active: number;
    draft: number;
    retired: number;
    chargeTypes: number;
    changesThisMonth: number;
  };
}

const cards = [
  { key: "active" as const, label: "Active tariff versions", icon: FileCheck, color: "#16A34A" },
  { key: "draft" as const, label: "Draft versions", icon: Pencil, color: "#D97706" },
  { key: "retired" as const, label: "Retired versions", icon: Archive, color: "#94A3B8" },
  { key: "chargeTypes" as const, label: "Charge types", icon: Layers, color: "#1B4F8B" },
  { key: "changesThisMonth" as const, label: "Tariff changes this month", icon: TrendingUp, color: "#0B2545" },
] as const;

export default function KPIStrip({ data }: KPIStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <span className="text-[22px] font-bold" style={{ color: card.color }}>
                {data[card.key]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}