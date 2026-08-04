"use client";

/**
 * FC-11 §E12–E13 · Payload compatibility, uplift, and file closure.
 *
 * The gap this closes, and it is the one that mattered most: the demo
 * treated **handover to ramp as the end of the export story**. FC-11 does
 * not. After E11 there is a decision — "Payload compatibility with Flight"
 * — whose No edge goes back to 09 Export Warehousing, annotated *"can be
 * offloaded depending upon weight provision"*.
 *
 * So cargo that passed every gate — screened, sealed, custody unbroken,
 * declaration cleared, build matching the PFM — can still come off the
 * aircraft, and when it does it re-enters the flow at warehousing rather
 * than dropping out of it. A model that stops at the ramp gate silently
 * claims a handover is an uplift. It is not; the aircraft decides.
 *
 * E13 closure is gated on the uplift actually happening, which is why an
 * offloaded consignment keeps its file open.
 *
 * BLK-02 — the export **invoice** half of FC-11's "15. Export Invoice /
 * Closure / Archive" is parked pending SAPS confirmation of the revenue
 * share (`INTERNATIONALCARGO`). The reference is shown; no amount is
 * invented behind it, and the gate says so rather than quietly passing.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Archive,
  CheckCircle2,
  PlaneTakeoff,
  Scale,
  Undo2,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { AuditStrip } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  EXPORT_STAGE_LABEL,
  evaluateClosure,
  evaluateUplift,
  formatDate,
  formatDateTime,
  formatKg,
  listExports,
  rampGateFor,
} from "@/lib/domain";

export default function ExportUpliftPage() {
  const { scope, isHq } = useSite();
  const rows = useMemo(() => listExports(scope), [scope]);

  const [selected, setSelected] = useState<number | null>(null);
  const c = rows.find((x) => x.id === selected) ?? rows[0] ?? null;

  const uplift = c ? evaluateUplift(c.uplift, c.booking) : null;
  const closure = c
    ? evaluateClosure({
        uplift: c.uplift,
        declaration: c.declaration,
        closure: c.closure,
        messagesSentAt: c.messagesSentAt,
      })
    : null;
  const ramp = c ? rampGateFor(c.id) : null;

  const onboarded = rows.filter((x) => x.uplift?.outcome === "onboarded");
  const offloaded = rows.filter((x) => x.uplift?.outcome === "offloaded");
  const closed = rows.filter((x) => x.closure?.fileClosedAt);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Export" }, { label: "Uplift & Closure" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M16 · M20
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-11 §E12–E13
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center font-mono">
              BLK-02
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Uplift &amp; Closure
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The aircraft&rsquo;s decision, and what it takes to close the file.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] px-5 py-4 flex items-start gap-3">
        <Undo2 size={17} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#7C3AED]">
            Handover to ramp is not uplift
          </p>
          <p className="text-[12px] text-[#4C1D95] mt-1 leading-relaxed">
            FC-11&rsquo;s payload decision sits <em>after</em> the ramp handover, and its No edge
            returns cargo to <strong>09 Export Warehousing</strong> — &ldquo;can be offloaded
            depending upon weight provision&rdquo;. A consignment can clear all five ramp
            conditions and still not fly. That is why the ramp gate and this decision are shown
            side by side below, and why an offload leaves the file open.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assessed", value: `${onboarded.length + offloaded.length} / ${rows.length}`, tone: "#0F172A" },
          { label: "Onboarded", value: String(onboarded.length), tone: "#16A34A" },
          { label: "Offloaded", value: String(offloaded.length), tone: offloaded.length ? "#D97706" : "#16A34A" },
          { label: "Files closed", value: String(closed.length), tone: "#0F172A" },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[22px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No export consignments at this site"
          description="E12 runs at the aircraft, after the ramp handover at E11."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <PlaneTakeoff size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Consignments</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {rows.map((x) => (
                <button
                  key={x.id}
                  onClick={() => setSelected(x.id)}
                  className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ backgroundColor: c?.id === x.id ? "#EBF0F7" : undefined }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                      {x.awbNo}
                    </span>
                    <span
                      className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center flex-shrink-0"
                      style={{
                        backgroundColor: !x.uplift
                          ? "#F1F5F9"
                          : x.uplift.outcome === "onboarded"
                            ? "#DCFCE7"
                            : "#FEF3C7",
                        color: !x.uplift
                          ? "#94A3B8"
                          : x.uplift.outcome === "onboarded"
                            ? "#16A34A"
                            : "#D97706",
                      }}
                    >
                      {!x.uplift ? "NOT ASSESSED" : x.uplift.outcome.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {x.flightNo ?? "—"} · {x.acceptance.DESTINATION}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                    {EXPORT_STAGE_LABEL[x.stage]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {c && uplift && closure && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Ramp gate vs payload — deliberately adjacent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="rounded-[16px] border p-5"
                  style={{
                    borderColor: ramp?.canHandOver ? "#BBF7D0" : "#FCA5A5",
                    backgroundColor: ramp?.canHandOver ? "#F0FDF4" : "#FEF2F2",
                  }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    E11 — ramp gate
                  </p>
                  <p
                    className="text-[15px] font-bold mt-1"
                    style={{ color: ramp?.canHandOver ? "#16A34A" : "#DC2626" }}
                  >
                    {ramp?.canHandOver ? "Cleared for handover" : "Blocked"}
                  </p>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    {ramp?.canHandOver
                      ? "All five conditions pass."
                      : `Blocked by ${ramp?.blockedBy.map((b) => b.label).join(", ")}.`}
                  </p>
                  <Link
                    href="/export/buildup"
                    className="text-[12px] font-semibold text-[#1B4F8B] hover:underline no-underline inline-flex items-center gap-1 mt-2"
                  >
                    Ramp conditions
                    <ArrowUpRight size={12} />
                  </Link>
                </div>

                <div
                  className="rounded-[16px] border p-5"
                  style={{
                    borderColor: !uplift.assessed
                      ? "#E2E8F0"
                      : uplift.compatible
                        ? "#BBF7D0"
                        : "#FDE68A",
                    backgroundColor: !uplift.assessed
                      ? "#F8FAFC"
                      : uplift.compatible
                        ? "#F0FDF4"
                        : "#FFFBEB",
                  }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    E12 — payload compatibility
                  </p>
                  <p
                    className="text-[15px] font-bold mt-1"
                    style={{
                      color: !uplift.assessed
                        ? "#94A3B8"
                        : uplift.compatible
                          ? "#16A34A"
                          : "#D97706",
                    }}
                  >
                    {!uplift.assessed
                      ? "Not assessed"
                      : uplift.compatible
                        ? "Onboarded"
                        : "Offloaded"}
                  </p>
                  <p className="text-[12px] text-[#64748B] mt-1">{uplift.summary}</p>
                </div>
              </div>

              {/* The payload numbers */}
              {c.uplift && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Scale size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        The payload decision
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        Assessed against payload at the ULD position, not against the booking.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                    {(
                      [
                        ["Available payload", formatKg(c.uplift.availablePayloadKg)],
                        ["Offered", formatKg(c.uplift.offeredWeightKg)],
                        [
                          "Margin",
                          `${uplift.marginKg !== null && uplift.marginKg > 0 ? "+" : ""}${formatKg(uplift.marginKg ?? 0)}`,
                        ],
                        [
                          "vs booked allotment",
                          uplift.overBookedKg === null
                            ? "—"
                            : `${uplift.overBookedKg > 0 ? "+" : ""}${formatKg(uplift.overBookedKg)}`,
                        ],
                        ["Assessed by", c.uplift.assessedBy],
                        ["Assessed at", formatDateTime(c.uplift.assessedAt)],
                        [
                          "Onboarded at",
                          c.uplift.onboardedAt ? formatDateTime(c.uplift.onboardedAt) : "—",
                        ],
                        ["Flight", c.flightNo ?? "—"],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          {k}
                        </span>
                        <span className="text-[13px] font-medium text-[#0F172A] break-words">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>

                  {c.uplift.outcome === "offloaded" && (
                    <div className="mx-5 mb-5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
                      <p className="text-[12px] font-semibold text-[#D97706]">
                        Offloaded — returned to E08 warehousing
                      </p>
                      <p className="text-[12px] text-[#92400E] mt-0.5">
                        {c.uplift.offloadReason}
                      </p>
                      {c.uplift.rebookedFlightNo && (
                        <p className="text-[12px] text-[#92400E] mt-1">
                          Rebooked onto <strong>{c.uplift.rebookedFlightNo}</strong> departing{" "}
                          {formatDate(c.uplift.rebookedDeparture!)}.{" "}
                          <Link
                            href="/export/warehousing"
                            className="font-semibold text-[#1B4F8B] hover:underline no-underline"
                          >
                            See it back in the store
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* E13 closure gate */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                  <Archive size={15} className="text-[#64748B]" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      E13 — closure &amp; archive
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      An offloaded consignment keeps its file open until it flies.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: closure.canClose ? "#BBF7D0" : "#FDE68A",
                      backgroundColor: closure.canClose ? "#F0FDF4" : "#FFFBEB",
                    }}
                  >
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: closure.canClose ? "#16A34A" : "#D97706" }}
                    >
                      {closure.canClose
                        ? "All conditions met — file can be closed"
                        : `${closure.blockedBy.length} condition${closure.blockedBy.length === 1 ? "" : "s"} outstanding`}
                    </p>
                  </div>

                  {closure.conditions.map((cond) => (
                    <div
                      key={cond.code}
                      className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
                      style={{
                        borderColor: cond.pass ? "#E2E8F0" : "#FDE68A",
                        backgroundColor: cond.pass ? "#FFFFFF" : "#FFFBEB",
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0F172A]">{cond.label}</p>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{cond.detail}</p>
                      </div>
                      {cond.pass ? (
                        <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0" />
                      ) : (
                        <XCircle size={18} className="text-[#D97706] flex-shrink-0" />
                      )}
                    </div>
                  ))}

                  {c.closure && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 pt-2">
                      {(
                        [
                          ["Invoice ref", c.closure.invoiceRef ?? "—"],
                          ["File closed", c.closure.fileClosedAt ? formatDateTime(c.closure.fileClosedAt) : "Open"],
                          ["Archive ref", c.closure.archiveRef ?? "—"],
                          ["Closed by", c.closure.closedBy ?? "—"],
                        ] as const
                      ).map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                            {k}
                          </span>
                          <span className="text-[13px] font-medium text-[#0F172A] break-words">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* BLK-02 stays visible rather than being quietly filled in */}
                  <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
                    <p className="text-[12px] font-semibold text-[#D97706]">
                      BLK-02 — export revenue share is not modelled
                    </p>
                    <p className="text-[12px] text-[#92400E] mt-0.5">
                      FC-11&rsquo;s end node is &ldquo;Export Invoice / Closure / Archive&rdquo;.
                      Closure and archive are built. The invoice carries a reference but no
                      amount: how export revenue splits between SAPS and the carrier
                      (<span className="font-mono">INTERNATIONALCARGO</span>) is unconfirmed, and
                      inventing a number here would make the demo assert a commercial term nobody
                      has agreed. Awaiting SAPS.
                    </p>
                  </div>
                </div>
              </div>

              <AuditStrip record={c} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
