"use client";

/**
 * P0-4 · Aging badge / dwell clock.
 *
 * FC-07 §02–03 starts the storage clock; FC-10's amendment makes it
 * load-bearing:
 *   "The dwell clock (FC-07) auto-fires the long-stay alert and drives the
 *    Section 82 statutory timeline"
 *
 * Three tones: inside the free period, accruing demurrage, past the
 * statutory threshold.
 */

import { Clock } from "lucide-react";

export interface AgingProps {
  totalDays: number;
  freeDays: number;
  /** Statutory threshold — Section82Days. Omit for a plain dwell badge. */
  section82Days?: number;
  compact?: boolean;
}

function tone(totalDays: number, freeDays: number, section82Days?: number) {
  if (section82Days !== undefined && totalDays >= section82Days) {
    return { bg: "#FEE2E2", fg: "#DC2626", dot: "#DC2626", label: "Section 82" };
  }
  if (totalDays > freeDays) {
    return { bg: "#FEF3C7", fg: "#D97706", dot: "#D97706", label: "Accruing" };
  }
  return { bg: "#DCFCE7", fg: "#16A34A", dot: "#16A34A", label: "Free period" };
}

export default function AgingBadge({ totalDays, freeDays, section82Days, compact }: AgingProps) {
  const t = tone(totalDays, freeDays, section82Days);
  const chargeableDays = Math.max(0, totalDays - freeDays);

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
        style={{ backgroundColor: t.bg, color: t.fg }}
        title={`${totalDays}d total · ${freeDays}d free · ${chargeableDays}d chargeable`}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.dot }} />
        {totalDays}d
      </span>
    );
  }

  const pastDeadline = section82Days !== undefined && totalDays >= section82Days;

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-[#64748B]" />
        <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
          Dwell clock
        </span>
        <span
          className="ml-auto inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: t.bg, color: t.fg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.dot }} />
          {t.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold leading-none" style={{ color: t.fg }}>
          {totalDays}
        </span>
        <span className="text-[13px] text-[#64748B]">days in storage</span>
      </div>

      {/* Free period vs chargeable, as a proportional bar */}
      <div className="mt-3 h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex">
        <div
          className="h-full bg-[#16A34A]"
          style={{ width: `${(Math.min(totalDays, freeDays) / Math.max(totalDays, freeDays, 1)) * 100}%` }}
        />
        <div
          className="h-full"
          style={{
            width: `${(chargeableDays / Math.max(totalDays, freeDays, 1)) * 100}%`,
            backgroundColor: pastDeadline ? "#DC2626" : "#D97706",
          }}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Free</p>
          <p className="text-[13px] font-semibold text-[#16A34A]">{freeDays}d</p>
        </div>
        <div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Chargeable</p>
          <p className="text-[13px] font-semibold text-[#D97706]">{chargeableDays}d</p>
        </div>
        {section82Days !== undefined && (
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Section 82</p>
            <p
              className="text-[13px] font-semibold"
              style={{ color: pastDeadline ? "#DC2626" : "#0F172A" }}
            >
              {pastDeadline
                ? `${totalDays - section82Days}d past`
                : `${section82Days - totalDays}d left`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
