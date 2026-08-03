"use client";

/**
 * Phase 3 · shared stage rail.
 *
 * FC-04 and all three FC-10 branches are staged flows with the same shape:
 * an ordered list of steps, a current position, and a tail that has not
 * happened yet. Four screens need it, so it lives here rather than being
 * re-implemented per screen.
 *
 * Deliberately *not* the FC-01 lifecycle bar — that one is horizontal and
 * spans 17 stages. Exception branches are short and read better vertically,
 * because each step carries a timestamp and an actor.
 */

import { Check, Circle, Dot } from "lucide-react";

export interface RailStep {
  key: string;
  label: string;
  /** Timestamp / actor / reference shown under the label once reached. */
  detail?: string | null;
}

export default function StageRail({
  steps,
  currentKey,
  title,
  note,
  tone = "#1B4F8B",
}: {
  steps: RailStep[];
  currentKey: string;
  title?: string;
  note?: string;
  tone?: string;
}) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
          <span className="text-[11px] text-[#94A3B8]">
            step {Math.max(0, currentIndex) + 1} of {steps.length}
          </span>
        </div>
      )}

      <ol className="relative">
        {steps.map((s, i) => {
          const done = currentIndex > i;
          const current = currentIndex === i;
          const last = i === steps.length - 1;
          const color = done ? "#16A34A" : current ? tone : "#CBD5E1";

          return (
            <li key={s.key} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && (
                <span
                  className="absolute left-[11px] top-6 bottom-0 w-px"
                  style={{ backgroundColor: done ? "#16A34A" : "#E2E8F0" }}
                />
              )}
              <span
                className="relative z-10 h-[23px] w-[23px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: done ? "#DCFCE7" : current ? `${tone}1A` : "#F1F5F9",
                  border: `1.5px solid ${color}`,
                }}
              >
                {done ? (
                  <Check size={12} style={{ color }} strokeWidth={3} />
                ) : current ? (
                  <Circle size={9} style={{ color }} fill={color} />
                ) : (
                  <Dot size={14} style={{ color }} />
                )}
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className="text-[13px] leading-snug"
                  style={{
                    color: done || current ? "#0F172A" : "#94A3B8",
                    fontWeight: current ? 600 : 500,
                  }}
                >
                  {s.label}
                </p>
                {s.detail && (
                  <p className="text-[11px] text-[#64748B] mt-0.5 break-words">{s.detail}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {note && (
        <p className="text-[11px] text-[#94A3B8] mt-3 pt-3 border-t border-[#F1F5F9]">{note}</p>
      )}
    </div>
  );
}
