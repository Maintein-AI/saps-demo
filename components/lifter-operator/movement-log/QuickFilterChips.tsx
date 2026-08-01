"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, AlertTriangle, Package, ArrowUp, ArrowDown, ArrowRight, Battery } from "lucide-react";

const filters = [
  { label: "Today", icon: Calendar },
  { label: "Current Shift", icon: CheckCircle2 },
  { label: "Completed", icon: CheckCircle2 },
  { label: "Exceptions", icon: AlertTriangle },
  { label: "Putaway", icon: ArrowDown },
  { label: "Pick", icon: ArrowUp },
  { label: "Move", icon: ArrowRight },
  { label: "Charge", icon: Battery },
];

interface QuickFilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function QuickFilterChips({ activeFilter, onFilterChange }: QuickFilterChipsProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Quick Filters</h2>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const Icon = f.icon;
            const active = activeFilter === f.label;
            return (
              <button
                key={f.label}
                onClick={() => onFilterChange(f.label)}
                className="flex items-center gap-2 h-11 px-4 rounded-xl text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
                style={{
                  backgroundColor: active ? "#0B2545" : "#F8FAFC",
                  color: active ? "#FFFFFF" : "#64748B",
                  borderColor: active ? "#0B2545" : "#E2E8F0",
                }}
              >
                <Icon size={15} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}