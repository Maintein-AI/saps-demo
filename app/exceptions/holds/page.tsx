"use client";

/**
 * P3-3 · Hold Register — full `HOLDINGSTATUS` (29 cols) parity.
 *
 * The existing `/excise-compliance/hold-register` shows who placed a hold.
 * CMTS also carries **seven release-side columns** — ReleasePersonName,
 * ReleaseCompany, ReleaseBy, ReleasePersonDesignation, ReleasePersonNic,
 * ReleaseRemarks, ReleaseDateTime — and the demo has never rendered any of
 * them. A hold you cannot see released is only half an audit trail, and
 * the release side is the half that matters in a dispute.
 *
 * Both parties are fully attributed here: name, NIC, company, designation
 * on the hold side and again on the release side.
 */

import { useMemo, useState } from "react";
import { KeyRound, Lock, LockOpen, ShieldCheck, UserCheck } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AgingBadge, AuditStrip } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  DEMO_NOW,
  HOLD_TYPE_LABEL,
  awbByNo,
  cargoClass,
  daysBetween,
  formatDate,
  formatDateTime,
  isHoldLive,
  listHolds,
  type HoldType,
} from "@/lib/domain";

const TYPE_TONE: Record<HoldType, { bg: string; fg: string }> = {
  customs: { bg: "#DBEAFE", fg: "#1B4F8B" },
  "cdr-osd": { bg: "#FEE2E2", fg: "#DC2626" },
  discrepancy: { bg: "#FEF3C7", fg: "#D97706" },
  security: { bg: "#F5F3FF", fg: "#7C3AED" },
  payment: { bg: "#DCFCE7", fg: "#16A34A" },
};

/** The seven CMTS release columns, in schema order. */
const RELEASE_COLUMNS = [
  "ReleasePersonName",
  "ReleaseCompany",
  "ReleaseBy",
  "ReleasePersonDesignation",
  "ReleasePersonNic",
  "ReleaseRemarks",
  "ReleaseDateTime",
] as const;

export default function HoldRegisterPage() {
  const { scope, isHq } = useSite();
  const holds = useMemo(() => listHolds(scope), [scope]);

  const [showReleased, setShowReleased] = useState(true);
  const visible = holds.filter((h) => (showReleased ? true : isHoldLive(h)));
  const [selectedSeq, setSelectedSeq] = useState<number | null>(visible[0]?.SEQUENCE ?? null);
  const sel = visible.find((h) => h.SEQUENCE === selectedSeq) ?? visible[0] ?? null;

  const live = holds.filter(isHoldLive);
  const released = holds.filter((h) => h.Release);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Exceptions" }, { label: "Hold Register" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M06
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              CMTS HOLDINGSTATUS · 29 cols
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Hold Register
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Both sides of every hold, fully attributed — including the seven CMTS release columns
            the demo has never shown.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Live holds", value: live.length, tone: "#DC2626" },
          { label: "Released", value: released.length, tone: "#16A34A" },
          {
            label: "Longest live hold",
            value: live.length
              ? `${Math.max(...live.map((h) => daysBetween(h.Date, DEMO_NOW)))}d`
              : "—",
            tone: "#D97706",
          },
          {
            label: "Hold types in use",
            value: new Set(holds.map((h) => h.type)).size,
            tone: "#1B4F8B",
          },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[24px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            [true, `All holds (${holds.length})`],
            [false, `Live only (${live.length})`],
          ] as const
        ).map(([v, label]) => (
          <button
            key={String(v)}
            onClick={() => {
              setShowReleased(v);
              setSelectedSeq(null);
            }}
            className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer"
            style={{
              backgroundColor: showReleased === v ? "#0B2545" : "#FFFFFF",
              color: showReleased === v ? "#FFFFFF" : "#475569",
              borderColor: showReleased === v ? "#0B2545" : "#E2E8F0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No holds at this site"
          description="Holds arrive from customs (FC-06), a CDR (FC-04), security screening, or an unpaid balance at the FC-07 release gate."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Lock size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Register</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {visible.map((h) => {
                const awb = awbByNo(h.AWBNo);
                const tone = TYPE_TONE[h.type];
                const days = daysBetween(h.Date, DEMO_NOW);
                return (
                  <button
                    key={h.SEQUENCE}
                    onClick={() => setSelectedSeq(h.SEQUENCE)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: sel?.SEQUENCE === h.SEQUENCE ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        {h.AWBNo}
                      </span>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center gap-0.5"
                        style={
                          h.Release
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {h.Release ? <LockOpen size={8} /> : <Lock size={8} />}
                        {h.Release ? "RELEASED" : "LIVE"}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1">
                      <span
                        className="h-[18px] px-1.5 rounded text-[10px] font-semibold inline-flex items-center"
                        style={{ backgroundColor: tone.bg, color: tone.fg }}
                      >
                        {HOLD_TYPE_LABEL[h.type]}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      {h.HeldBy} · {formatDate(h.Date)} · {days}d
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {sel && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* AWB context */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <AwbLink awbNo={sel.AWBNo} awbId={awbByNo(sel.AWBNo)?.AWBId ?? 0} />
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                        style={{
                          backgroundColor: TYPE_TONE[sel.type].bg,
                          color: TYPE_TONE[sel.type].fg,
                        }}
                      >
                        {HOLD_TYPE_LABEL[sel.type]}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      IGM {sel.IGMNO} · {cargoClass(sel.CARGOCLASSID).ABBREVATION}
                      {sel.HWBNo ? ` · HAWB ${sel.HWBNo}` : ""} · sequence {sel.SEQUENCE}
                    </p>
                  </div>
                  <AgingBadge
                    totalDays={daysBetween(sel.Date, sel.ReleaseDateTime ?? DEMO_NOW)}
                    freeDays={cargoClass(sel.CARGOCLASSID).freeDays}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Hold side */}
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#FEF2F2] flex items-center gap-2">
                    <Lock size={15} className="text-[#DC2626]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">Hold side</h3>
                      <p className="text-[11px] text-[#94A3B8]">Who placed it, and on what basis</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-4">
                    {(
                      [
                        ["HeldBy", sel.HeldBy],
                        ["NameOfPerson", sel.NameOfPerson],
                        ["NIC", sel.NIC],
                        ["HoldingCompany", sel.HoldingCompany],
                        ["Designation", sel.Designation],
                        ["Date", formatDateTime(sel.Date)],
                        ["STATUS", sel.STATUS],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                        <span className="text-[13px] font-medium text-[#0F172A] break-words">
                          {v}
                        </span>
                      </div>
                    ))}
                    <div className="col-span-2 flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-[#CBD5E1]">REMARKS</span>
                      <span className="text-[13px] text-[#475569]">{sel.REMARKS}</span>
                    </div>
                  </div>
                </div>

                {/* Release side — the seven columns */}
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div
                    className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2"
                    style={{ backgroundColor: sel.Release ? "#F0FDF4" : "#F8FAFC" }}
                  >
                    {sel.Release ? (
                      <LockOpen size={15} className="text-[#16A34A]" />
                    ) : (
                      <KeyRound size={15} className="text-[#94A3B8]" />
                    )}
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">Release side</h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        Seven CMTS columns — never rendered before this screen
                      </p>
                    </div>
                  </div>

                  {sel.Release ? (
                    <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-4">
                      {RELEASE_COLUMNS.map((k) => {
                        const raw = sel[k];
                        const v =
                          k === "ReleaseDateTime" && raw ? formatDateTime(raw as string) : raw;
                        return (
                          <div
                            key={k}
                            className={k === "ReleaseRemarks" ? "col-span-2 flex flex-col gap-1" : "flex flex-col gap-1"}
                          >
                            <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                            <span className="text-[13px] font-medium text-[#0F172A] break-words">
                              {v ?? "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center">
                        <ShieldCheck size={20} className="text-[#94A3B8] mx-auto" />
                        <p className="text-[13px] font-semibold text-[#475569] mt-2">
                          Hold is live — release side empty
                        </p>
                        <p className="text-[12px] text-[#94A3B8] mt-1">
                          All seven columns stay null until a release is recorded. Releasing
                          requires a named person, NIC, company and designation — the same
                          attribution the hold side demands.
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        {RELEASE_COLUMNS.map((k) => (
                          <div key={k} className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-mono text-[#94A3B8]">{k}</span>
                            <span className="text-[11px] text-[#CBD5E1]">null</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {sel.Release && sel.ReleaseDateTime && (
                <div className="rounded-[16px] border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-4 flex items-start gap-3">
                  <UserCheck size={16} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#16A34A]">
                      Released after {daysBetween(sel.Date, sel.ReleaseDateTime)} days
                    </p>
                    <p className="text-[12px] text-[#15803D] mt-0.5">
                      {sel.ReleasePersonName} ({sel.ReleasePersonDesignation}, {sel.ReleaseCompany})
                      on {formatDateTime(sel.ReleaseDateTime)}. Both parties are attributable by NIC
                      — this is the pair of records a dispute is settled on.
                    </p>
                  </div>
                </div>
              )}

              <AuditStrip record={sel} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
