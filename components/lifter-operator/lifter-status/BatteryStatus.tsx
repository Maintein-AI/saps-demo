"use client";

import { Battery, Clock, ArrowUp, ArrowDown } from "lucide-react";

interface BatteryStatusProps {
  battery: number;
  runtime: string;
  threshold: number;
  status: string;
}

export default function BatteryStatus({ battery, runtime, threshold, status }: BatteryStatusProps) {
  const isGood = battery >= 60;
  const isLow = battery >= threshold && battery < 60;
  const isCritical = battery < threshold;
  const isCharging = status === "Charging";

  const statusColor = isCharging
    ? "#D97706"
    : isGood
    ? "#16A34A"
    : isLow
    ? "#D97706"
    : "#DC2626";
  const statusBg = isCharging
    ? "#FEF3C7"
    : isGood
    ? "#DCFCE7"
    : isLow
    ? "#FEF3C7"
    : "#FEE2E2";

  const barColor = isCharging
    ? "#D97706"
    : isGood
    ? "#16A34A"
    : isLow
    ? "#D97706"
    : "#DC2626";

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Battery Status</h2>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-20 h-32 border-2 border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] flex-shrink-0">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#E2E8F0] rounded-t-md" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-b-2xl transition-all duration-500"
            style={{
              height: `${battery}%`,
              backgroundColor: barColor,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[20px] font-black text-[#0F172A]" style={{ textShadow: "0 0 4px white" }}>
              {battery}%
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">Status</p>
            <span
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[13px] font-bold mt-1"
              style={{ backgroundColor: statusBg, color: statusColor }}
            >
              <Battery size={14} />
              {status}
            </span>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">Est. Runtime</p>
            <p className="text-[18px] font-bold text-[#0F172A] mt-1">{runtime}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">Charge Threshold</p>
            <p className="text-[14px] font-bold text-[#0F172A] mt-1">{threshold}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
            <ArrowDown size={14} className="text-[#1B4F8B]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Drain Rate</p>
            <p className="text-[14px] font-bold text-[#0F172A]">3%/hr</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
            <ArrowUp size={14} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] font-medium">Charge Rate</p>
            <p className="text-[14px] font-bold text-[#0F172A]">12%/hr</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3 col-span-2">
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Clock size={14} className="text-[#64748B]" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-[#94A3B8] font-medium">Time to Charge</p>
            <p className="text-[14px] font-bold text-[#0F172A]">
              {isCharging ? "Currently charging" : isCritical ? "Charge now — critical" : `~${Math.ceil((threshold - battery) / 12)} hrs to reach ${threshold}%`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}