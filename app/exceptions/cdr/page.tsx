"use client";

/**
 * P3-1 · CDR Workbench — FC-04 end to end.
 *
 * The existing `/warehouse-manager/exceptions-queue` is a queue: it lists
 * things that went wrong. FC-04 asks for a *workbench* — the place the
 * discrepancy is worked, which the demo has never had. The three
 * amendments this screen exists to carry:
 *
 *   §01  "Discrepancy auto-raised from the FC-01/FC-02 intake variance
 *         when it exceeds tolerance" — vs manually opened in CMTS.
 *   §03  "Evidence pack captured digitally: scan / photos, RFID/AWB-linked,
 *         timestamped, attached to the CDR" — vs remarks-only in CMTS.
 *   §11  Five final actions, three of which hand off to another flow
 *         (FC-10-A, FC-10-B) rather than closing here.
 *
 * The 9 discrepancy types and 6 evidence kinds are modelled verbatim in
 * lib/domain/exceptions.ts, so this screen renders them rather than
 * re-listing them.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Bell,
  ClipboardList,
  Radio,
  RotateCcw,
  Zap,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import StageRail, { type RailStep } from "@/components/exceptions/StageRail";
import { AuditStrip, DocNumber, EvidencePack } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  CDR_FINAL_ACTION_LABEL,
  DISCREPANCY_LABEL,
  VARIANCE_DERIVED_TYPES,
  VARIANCE_TOLERANCE,
  formatDateTime,
  listCdrs,
  storageLocation,
  type CdrFinalAction,
  type CdrStatus,
  type DiscrepancyType,
} from "@/lib/domain";

/** FC-04 §01–12 as a rail. */
const CDR_STATUS_ORDER: CdrStatus[] = [
  "draft",
  "evidence",
  "notified",
  "on-hold",
  "awaiting-instruction",
  "action-selected",
  "closed",
];

const CDR_STATUS_LABEL: Record<CdrStatus, string> = {
  draft: "§01–02. Discrepancy identified, type selected",
  evidence: "§03–05. Evidence pack captured, CDR reference assigned",
  notified: "§06–08. Airline / customs notified, DIS message sent",
  "on-hold": "§09. Cargo held in quarantine zone",
  "awaiting-instruction": "§10. Awaiting airline / customs instruction",
  "action-selected": "§11. Final action selected",
  closed: "§12. CDR closed",
};

/** FC-04 §11 — which actions leave FC-04 for another flow. */
const ACTION_HANDOFF: Record<CdrFinalAction, { href: string | null; note: string }> = {
  "F1-release-after-correction": {
    href: null,
    note: "Closes inside FC-04 — cargo rejoins the main flow at FC-07 charging.",
  },
  "F2-adjust-pieces-weight": {
    href: null,
    note: "Closes inside FC-04 — adjusted pieces/weight re-drive the FC-07 charge basis.",
  },
  "F3-forward-mishandled": {
    href: "/exceptions/mishandled",
    note: "Hands off to FC-10-A. The CDR closes only once the mishandled case is re-tendered.",
  },
  "F4-re-export": {
    href: "/exceptions/re-export",
    note: "Hands off to FC-10-B. Import AWB stays open until the re-export SD is granted.",
  },
  "F5-claim-liability": {
    href: null,
    note: "Opens a carrier liability claim. No demo module — flagged on the module map.",
  },
};

export default function CdrWorkbenchPage() {
  const { scope, isHq } = useSite();
  const cdrs = useMemo(() => listCdrs(scope), [scope]);

  const [selectedId, setSelectedId] = useState<number | null>(cdrs[0]?.id ?? null);
  const cdr = cdrs.find((c) => c.id === selectedId) ?? cdrs[0] ?? null;

  /** Local-only: lets the walkthrough exercise §11 without a backend. */
  const [draftAction, setDraftAction] = useState<CdrFinalAction | null>(null);
  const chosen = cdr?.finalAction ?? draftAction;

  const openCount = cdrs.filter((c) => c.status !== "closed").length;
  const autoRaised = cdrs.filter((c) => c.autoRaised).length;

  const rail: RailStep[] = cdr
    ? CDR_STATUS_ORDER.map((s) => ({
        key: s,
        label: CDR_STATUS_LABEL[s],
        detail:
          s === "evidence" && cdr.evidence.length
            ? `${cdr.evidence.length} of 6 evidence items captured`
            : s === "notified"
              ? [
                  cdr.airlineNotifiedAt && `Airline ${formatDateTime(cdr.airlineNotifiedAt)}`,
                  cdr.customsNotifiedAt
                    ? `Customs ${formatDateTime(cdr.customsNotifiedAt)}`
                    : "Customs not notified",
                  cdr.disMessageSentAt && `DIS ${formatDateTime(cdr.disMessageSentAt)}`,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : s === "on-hold" && cdr.holdLocationId
                ? `Quarantine zone ${storageLocation(cdr.holdLocationId)?.ABBREVATION ?? "—"}`
                : s === "awaiting-instruction"
                  ? cdr.instructionReceivedAt
                    ? `Instruction ${formatDateTime(cdr.instructionReceivedAt)}`
                    : `Escalated ${cdr.escalationCount}×, no instruction yet`
                  : s === "action-selected" && cdr.finalAction
                    ? CDR_FINAL_ACTION_LABEL[cdr.finalAction]
                    : s === "closed" && cdr.closedAt
                      ? formatDateTime(cdr.closedAt)
                      : null,
      }))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Exceptions" }, { label: "CDR Workbench" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M06
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-04 §01–12
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Cargo Discrepancy Report
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The discrepancy is worked here, not just listed. Auto-raised from intake variance,
            evidenced digitally, and closed through one of five final actions.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open CDRs", value: openCount, tone: "#DC2626" },
          { label: "Auto-raised from variance", value: autoRaised, tone: "#1B4F8B" },
          {
            label: "Awaiting instruction",
            value: cdrs.filter((c) => c.status === "awaiting-instruction").length,
            tone: "#D97706",
          },
          {
            label: "Escalations",
            value: cdrs.reduce((n, c) => n + c.escalationCount, 0),
            tone: "#7C3AED",
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

      {/* FC-04 §02 — the nine types, with the three that auto-raise marked */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              Discrepancy types — FC-04 §02
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Nine types. The three highlighted fall straight out of intake variance and open a CDR
              without an operator — the FC-04 §01 amendment.
            </p>
          </div>
          <span className="h-[22px] px-2.5 rounded-full bg-[#EBF0F7] text-[#1B4F8B] text-[10px] font-bold inline-flex items-center gap-1">
            <Zap size={10} />
            tolerance ±{(VARIANCE_TOLERANCE * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DISCREPANCY_LABEL) as DiscrepancyType[]).map((t) => {
            const auto = VARIANCE_DERIVED_TYPES.includes(t);
            const active = cdr?.type === t;
            return (
              <span
                key={t}
                className="h-[28px] px-3 rounded-full text-[12px] font-semibold inline-flex items-center gap-1.5 border"
                style={{
                  backgroundColor: active ? "#FEE2E2" : auto ? "#EBF0F7" : "#F8FAFC",
                  color: active ? "#DC2626" : auto ? "#1B4F8B" : "#64748B",
                  borderColor: active ? "#FCA5A5" : auto ? "#C7D7EC" : "#E2E8F0",
                }}
              >
                {auto && <Zap size={10} />}
                {DISCREPANCY_LABEL[t]}
              </span>
            );
          })}
        </div>
      </div>

      {cdrs.length === 0 ? (
        <EmptyState
          title="No CDRs at this site"
          description="A CDR opens automatically when FC-01 intake variance exceeds tolerance, or manually from the exceptions queue."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Register */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <ClipboardList size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">CDR register</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {cdrs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setDraftAction(null);
                  }}
                  className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ backgroundColor: cdr?.id === c.id ? "#EBF0F7" : undefined }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                      {c.cdrRef}
                    </span>
                    {c.autoRaised && (
                      <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#1B4F8B] text-[9px] font-bold inline-flex items-center gap-0.5">
                        <Zap size={8} />
                        AUTO
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    {c.AWBNO} · {DISCREPANCY_LABEL[c.type]}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {CDR_STATUS_LABEL[c.status].split(". ")[1] ?? c.status}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {cdr && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Header card */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DocNumber doc={cdr.docNumber} />
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                        style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                      >
                        <AlertTriangle size={10} />
                        {DISCREPANCY_LABEL[cdr.type]}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      Raised {formatDateTime(cdr.raisedAt)} by{" "}
                      <span className="font-medium text-[#0F172A]">{cdr.raisedBy}</span>
                    </p>
                  </div>
                  <AwbLink awbNo={cdr.AWBNO} awbId={cdr.awbId} />
                </div>

                {cdr.variance && (
                  <div className="mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={13} className="text-[#DC2626]" />
                      <p className="text-[12px] font-semibold text-[#DC2626]">
                        Auto-raised — variance exceeded tolerance at intake
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2">
                      {[
                        ["Declared", String(cdr.variance.declared)],
                        ["Physical", String(cdr.variance.physical)],
                        ["Delta", String(cdr.variance.delta)],
                        ["Ratio", `${(cdr.variance.ratio * 100).toFixed(1)}%`],
                      ].map(([l, v]) => (
                        <div key={l} className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-[#B91C1C] uppercase tracking-wider">
                            {l}
                          </span>
                          <span className="text-[14px] font-bold text-[#7F1D1D]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <StageRail
                  steps={rail}
                  currentKey={cdr.status}
                  title="FC-04 progress"
                  tone="#DC2626"
                  note="Steps 06–08 fan out to the messaging engine (M07); step 09 holds cargo in the quarantine zone (M05)."
                />

                <div className="flex flex-col gap-5">
                  {/* §06–08 notification state */}
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                    <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">
                      Notifications — FC-04 §06–08
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { icon: Bell, label: "Airline notified", at: cdr.airlineNotifiedAt },
                        { icon: Bell, label: "Customs notified", at: cdr.customsNotifiedAt },
                        { icon: Radio, label: "DIS message sent (IATA)", at: cdr.disMessageSentAt },
                      ].map(({ icon: Icon, label, at }) => (
                        <div key={label} className="flex items-center gap-2.5">
                          <span
                            className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: at ? "#DCFCE7" : "#F1F5F9" }}
                          >
                            <Icon size={12} style={{ color: at ? "#16A34A" : "#94A3B8" }} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-[#0F172A]">{label}</p>
                            <p className="text-[11px] text-[#94A3B8]">
                              {at ? formatDateTime(at) : "Not sent"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!cdr.customsNotifiedAt && (
                      <p className="text-[11px] text-[#D97706] mt-3 pt-3 border-t border-[#F1F5F9]">
                        Customs has not been notified — FC-04 §07 requires it before the instruction
                        loop can close.
                      </p>
                    )}
                  </div>

                  {/* §10 instruction loop */}
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Instruction loop — §10
                      </h3>
                      <span
                        className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                        style={{
                          backgroundColor: cdr.escalationCount > 0 ? "#FEF3C7" : "#F1F5F9",
                          color: cdr.escalationCount > 0 ? "#D97706" : "#64748B",
                        }}
                      >
                        <RotateCcw size={10} />
                        {cdr.escalationCount} escalation
                        {cdr.escalationCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    {cdr.instructionReceivedAt ? (
                      <>
                        <p className="text-[13px] text-[#0F172A]">{cdr.instructionText}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-1">
                          Received {formatDateTime(cdr.instructionReceivedAt)}
                        </p>
                      </>
                    ) : (
                      <p className="text-[12px] text-[#64748B]">
                        No instruction received. FC-04 §10 returns the CDR to hold and re-escalates
                        each cycle — the count above is what the aging dashboard reads.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* §03 evidence pack */}
              <EvidencePack items={cdr.evidence} />

              {/* §11 final action */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <h3 className="text-[14px] font-semibold text-[#0F172A]">
                  Final action — FC-04 §11
                </h3>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 mb-3">
                  Five options. Two close inside FC-04; two hand off to an FC-10 branch; one opens a
                  liability claim.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(Object.keys(CDR_FINAL_ACTION_LABEL) as CdrFinalAction[]).map((a) => {
                    const active = chosen === a;
                    const handoff = ACTION_HANDOFF[a];
                    return (
                      <button
                        key={a}
                        onClick={() => setDraftAction(a)}
                        className="text-left rounded-xl border px-4 py-3 transition-colors cursor-pointer hover:border-[#94A3B8]"
                        style={{
                          borderColor: active ? "#1B4F8B" : "#E2E8F0",
                          backgroundColor: active ? "#EBF0F7" : "#FFFFFF",
                        }}
                      >
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: active ? "#1B4F8B" : "#0F172A" }}
                        >
                          {CDR_FINAL_ACTION_LABEL[a]}
                        </p>
                        <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                          {handoff.note}
                        </p>
                        {handoff.href && (
                          <Link
                            href={handoff.href}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] no-underline hover:underline mt-1.5"
                          >
                            Open branch <ArrowUpRight size={11} />
                          </Link>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!cdr.finalAction && (
                  <div className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 flex items-start gap-2.5">
                    <Ban size={14} className="text-[#D97706] flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#92400E]">
                      No action committed on this CDR — it is still in the §10 loop. Selecting above
                      is a walkthrough affordance only; the demo has no backend, so nothing is
                      persisted.
                    </p>
                  </div>
                )}
              </div>

              <AuditStrip record={cdr} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
