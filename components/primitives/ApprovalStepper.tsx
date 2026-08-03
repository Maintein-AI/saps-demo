"use client";

/**
 * P0-4 · Role-based multi-level approval chain.
 *
 * FC-07 amendment:
 *   "Waiver / adjustment runs role-based multi-level approval (Finance Mgr)
 *    + full audit → credit note / revised invoice."
 *
 * Also used by FC-04 (instruction), FC-10 (final disposition) and the
 * P10-2 role-restricted actions.
 */

import { Check, Clock, X } from "lucide-react";
import { formatDateTime, type ApprovalLevel } from "@/lib/domain";

const DECISION = {
  approved: { bg: "#DCFCE7", fg: "#16A34A", ring: "#16A34A", Icon: Check, label: "Approved" },
  rejected: { bg: "#FEE2E2", fg: "#DC2626", ring: "#DC2626", Icon: X, label: "Rejected" },
  pending: { bg: "#F1F5F9", fg: "#64748B", ring: "#CBD5E1", Icon: Clock, label: "Pending" },
} as const;

export default function ApprovalStepper({
  levels,
  title = "Approval chain",
  note,
}: {
  levels: ApprovalLevel[];
  title?: string;
  note?: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
        <span className="text-[11px] text-[#94A3B8]">
          {levels.filter((l) => l.decision === "approved").length}/{levels.length} levels
        </span>
      </div>

      <ol className="relative">
        {levels.map((lvl, i) => {
          const d = DECISION[lvl.decision];
          const last = i === levels.length - 1;
          return (
            <li key={lvl.level} className="relative flex gap-3 pb-5 last:pb-0">
              {!last && (
                <span
                  className="absolute left-[13px] top-7 bottom-0 w-[2px]"
                  style={{
                    backgroundColor: lvl.decision === "approved" ? "#16A34A" : "#E2E8F0",
                  }}
                />
              )}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 bg-white"
                style={{ borderColor: d.ring }}
              >
                <d.Icon size={13} style={{ color: d.fg }} strokeWidth={2.5} />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    Level {lvl.level} — {lvl.role}
                  </span>
                  <span
                    className="h-[18px] px-1.5 rounded text-[10px] font-bold inline-flex items-center"
                    style={{ backgroundColor: d.bg, color: d.fg }}
                  >
                    {d.label}
                  </span>
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  {lvl.approver ? `${lvl.approver}` : "Awaiting an approver at this level"}
                  {lvl.decidedAt ? ` · ${formatDateTime(lvl.decidedAt)}` : ""}
                </p>
                {lvl.comment && (
                  <p className="text-[12px] text-[#0F172A] mt-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                    {lvl.comment}
                  </p>
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
