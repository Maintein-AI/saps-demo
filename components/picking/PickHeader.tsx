"use client";
import { CheckCircle2, Clock, Truck, ClipboardList, DollarSign, UserCheck, Shield, AlertTriangle } from "lucide-react";

interface PickHeaderProps {
  scanned: number;
  total: number;
}

export default function PickHeader({ scanned, total }: PickHeaderProps) {
  const progress = (scanned / total) * 100;
  const remaining = total - scanned;

  const fields = [
    { label: "Gate Pass #", value: "GP-2026-05131", icon: ClipboardList },
    { label: "Vehicle #", value: "KHI-4582", icon: Truck },
    { label: "DO #", value: "DO-90871", icon: DollarSign },
    { label: "AWB #", value: "214-45678901", icon: ClipboardList },
    { label: "Total pieces", value: total.toString(), icon: ClipboardList },
    { label: "Scanned", value: scanned.toString(), icon: CheckCircle2 },
    { label: "Remaining", value: remaining.toString(), icon: Clock },
    { label: "Status", value: "In Progress", icon: Clock },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">Pick List Header</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-[#64748B]">Pick Progress</span>
          <span className="text-[12px] font-bold text-[#0F172A]">{scanned} / {total} pieces scanned</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: progress === 100 ? "#16A34A" : "#1B4F8B" }}
          />
        </div>
      </div>

      {/* Header fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Icon size={14} className="text-[#94A3B8]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{field.label}</span>
              </div>
              <span className="text-[14px] font-bold text-[#0F172A]">{field.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}