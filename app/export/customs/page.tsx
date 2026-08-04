"use client";

/**
 * FC-11 §E05 · Customs / ANF check, the correction loop, and the PSW export
 * declaration.
 *
 * The gap this closes: the demo modelled export customs as a single
 * cleared/not-cleared state. FC-11 does not draw it that way. It draws:
 *
 *   Custom / ANF Check ─┬→ Inspection for Clearance ─┐
 *                       └→ Document Check (AWB / GD) ─┴→ Clearance?
 *                                                        │ Yes → Physical Check
 *                                                        │ No  → Hold till correction?
 *                                                                 │ Yes → back to the check
 *                                                                 └ No  → Returned / Detained
 *
 * Two arms feeding one decision, and the hold is itself a decision with a
 * terminal reject on its No edge. A boolean cannot express a consignment
 * on its second correction round — which is the state an export desk
 * spends most of its day in, and the one a shipper phones about.
 *
 * So rounds are modelled individually and shown as a history. "Cleared on
 * round 2 after the GD came back signed" is a different operational fact
 * from "cleared", and only one of them tells you the desk is working.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  FileWarning,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  Stamp,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { AuditStrip } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  CLEARANCE_OUTCOME_LABEL,
  EXPORT_STAGE_LABEL,
  clearanceState,
  formatDate,
  formatDateTime,
  formatPkr,
  listExports,
  type ClearanceOutcome,
} from "@/lib/domain";

const OUTCOME_TONE: Record<ClearanceOutcome, { bg: string; fg: string; border: string }> = {
  cleared: { bg: "#DCFCE7", fg: "#16A34A", border: "#BBF7D0" },
  "held-for-correction": { bg: "#FEF3C7", fg: "#D97706", border: "#FDE68A" },
  "returned-to-shipper": { bg: "#FEE2E2", fg: "#DC2626", border: "#FCA5A5" },
  detained: { bg: "#FEE2E2", fg: "#DC2626", border: "#FCA5A5" },
};

const ARM_LABEL = {
  inspection: "Inspection for clearance",
  "document-check": "Document check — AWB / GD signed",
} as const;

export default function ExportCustomsPage() {
  const { scope, isHq } = useSite();
  const rows = useMemo(() => listExports(scope), [scope]);

  const [selected, setSelected] = useState<number | null>(null);
  const c = rows.find((x) => x.id === selected) ?? rows[0] ?? null;
  const state = c ? clearanceState(c.clearance) : null;

  const inLoop = rows.filter((x) => clearanceState(x.clearance).inCorrectionLoop);
  const terminal = rows.filter((x) => clearanceState(x.clearance).terminal);
  const withCorrections = rows.filter((x) => clearanceState(x.clearance).corrections > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Export" }, { label: "Customs & ANF" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M16
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-11 §E05
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GREENFIELD
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Export Customs &amp; ANF
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The check, the correction loop, and the PSW export declaration.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] px-5 py-4 flex items-start gap-3">
        <RotateCcw size={17} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#7C3AED]">
            The check is a loop, not a gate
          </p>
          <p className="text-[12px] text-[#4C1D95] mt-1 leading-relaxed">
            FC-11 routes a failed clearance to <strong>&ldquo;Hold till correction&rdquo;</strong>,
            which loops back to the Custom / ANF check on Yes and to{" "}
            <strong>returned to shipper / detained</strong> on No. Each pass is recorded separately
            below, because &ldquo;cleared on round 2 after the GD came back signed&rdquo; and
            &ldquo;cleared&rdquo; are different operational facts. Export is PSW-primary from day
            one — there is no WeBOC parallel run to fall back on as there is on the import side.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Consignments", value: String(rows.length), tone: "#0F172A" },
          { label: "In correction loop", value: String(inLoop.length), tone: inLoop.length ? "#D97706" : "#16A34A" },
          { label: "Needed a correction", value: String(withCorrections.length), tone: "#7C3AED" },
          { label: "Returned / detained", value: String(terminal.length), tone: terminal.length ? "#DC2626" : "#16A34A" },
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
          description="E05 runs after weighment and before the physical check."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Stamp size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">At the export desk</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {rows.map((x) => {
                const st = clearanceState(x.clearance);
                const last = st.last;
                const tone = last ? OUTCOME_TONE[last.outcome] : OUTCOME_TONE.cleared;
                return (
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
                        style={{ backgroundColor: tone.bg, color: tone.fg }}
                      >
                        {last ? CLEARANCE_OUTCOME_LABEL[last.outcome].toUpperCase() : "—"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {x.acceptance.DESTINATION} · {x.acceptance.AIRLINEABB} ·{" "}
                      {st.rounds} round{st.rounds === 1 ? "" : "s"}
                    </p>
                    {st.corrections > 0 && (
                      <p className="text-[11px] text-[#D97706] mt-0.5">
                        {st.corrections} correction{st.corrections === 1 ? "" : "s"} required
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {c && state && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Where it settled */}
              <div
                className="rounded-[16px] border p-5 flex items-start gap-3"
                style={{
                  borderColor: state.cleared
                    ? "#BBF7D0"
                    : state.terminal
                      ? "#FCA5A5"
                      : "#FDE68A",
                  backgroundColor: state.cleared
                    ? "#F0FDF4"
                    : state.terminal
                      ? "#FEF2F2"
                      : "#FFFBEB",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: state.cleared
                      ? "#DCFCE7"
                      : state.terminal
                        ? "#FEE2E2"
                        : "#FEF3C7",
                  }}
                >
                  {state.cleared ? (
                    <BadgeCheck size={17} className="text-[#16A34A]" strokeWidth={2.5} />
                  ) : state.terminal ? (
                    <ShieldAlert size={17} className="text-[#DC2626]" strokeWidth={2.5} />
                  ) : (
                    <FileWarning size={17} className="text-[#D97706]" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F172A]">
                    {c.awbNo} —{" "}
                    {state.cleared
                      ? state.corrections > 0
                        ? `cleared on round ${state.rounds} after ${state.corrections} correction${state.corrections === 1 ? "" : "s"}`
                        : "cleared on the first round"
                      : state.inCorrectionLoop
                        ? "held till correction — awaiting the shipper"
                        : state.terminal
                          ? CLEARANCE_OUTCOME_LABEL[c.clearance.settledAs!]
                          : "in progress"}
                  </p>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    {EXPORT_STAGE_LABEL[c.stage]}
                    {c.clearance.settledAt ? ` · settled ${formatDateTime(c.clearance.settledAt)}` : ""}
                  </p>
                </div>
              </div>

              {/* Round history */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    Check rounds — both arms, each pass
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Inspection and document check feed the same Clearance? decision.
                  </p>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {c.clearance.rounds.map((r) => {
                    const tone = OUTCOME_TONE[r.outcome];
                    return (
                      <div
                        key={r.round}
                        className="rounded-xl border px-4 py-3.5"
                        style={{ borderColor: tone.border, backgroundColor: tone.bg }}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-bold text-[#0F172A]">
                                Round {r.round}
                              </span>
                              <span
                                className="h-[18px] px-1.5 rounded text-[10px] font-bold inline-flex items-center"
                                style={{ backgroundColor: "#FFFFFF", color: tone.fg }}
                              >
                                {CLEARANCE_OUTCOME_LABEL[r.outcome]}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-1">
                              {formatDateTime(r.startedAt)}
                              {r.closedAt ? ` → ${formatDateTime(r.closedAt)}` : " · open"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {r.arms.map((arm) => (
                            <div
                              key={arm}
                              className="rounded-lg bg-white border border-[#E2E8F0] px-3 py-2"
                            >
                              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                                {ARM_LABEL[arm]}
                              </p>
                              <p className="text-[12px] text-[#0F172A] mt-0.5">
                                {arm === "inspection"
                                  ? (r.inspectingOfficer ?? "Not run this round")
                                  : (r.documentsSignedBy ?? "Not signed")}
                              </p>
                            </div>
                          ))}
                          {r.anfRequired && (
                            <div className="rounded-lg bg-white border border-[#E2E8F0] px-3 py-2">
                              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                                ANF clearance
                              </p>
                              <p className="text-[12px] text-[#0F172A] mt-0.5">
                                {r.anfClearedAt
                                  ? `Cleared ${formatDateTime(r.anfClearedAt)}`
                                  : "Required — outstanding"}
                              </p>
                            </div>
                          )}
                        </div>

                        {r.defect && (
                          <div className="mt-3 rounded-lg bg-white border border-[#FCA5A5] px-3 py-2">
                            <p className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wider">
                              Defect to correct
                            </p>
                            <p className="text-[12px] text-[#0F172A] mt-0.5">{r.defect}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Declaration */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                  <ScrollText size={15} className="text-[#64748B]" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      Export declaration — SD + Form-E via PSW EDI
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      PSW-primary from day one; no WeBOC fallback on the export side.
                    </p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                  {(
                    [
                      ["SD reference", c.declaration.sdRef ?? "Not lodged"],
                      ["Lodged", c.declaration.sdLodgedAt ? formatDateTime(c.declaration.sdLodgedAt) : "—"],
                      ["PSW ack", c.declaration.pswAckRef ?? "—"],
                      ["Cleared", c.declaration.clearedAt ? formatDateTime(c.declaration.clearedAt) : "Not cleared"],
                      ["Form-E", c.declaration.formERef ?? "—"],
                      ["Form-E bank", c.declaration.formEBank ?? "—"],
                      ["Form-E value", formatPkr(c.declaration.formEValue)],
                      ["Form-E expiry", c.declaration.formEExpiry ? formatDate(c.declaration.formEExpiry) : "—"],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        {k}
                      </span>
                      <span className="text-[13px] font-medium text-[#0F172A] break-words">{v}</span>
                    </div>
                  ))}
                </div>
                {c.declaration.rejectionCode && (
                  <div className="mx-5 mb-5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3">
                    <p className="text-[12px] font-semibold text-[#DC2626]">
                      Rejected — {c.declaration.rejectionCode}
                    </p>
                    <p className="text-[12px] text-[#0F172A] mt-0.5">
                      {c.declaration.rejectionText}
                    </p>
                  </div>
                )}
                <div className="px-5 pb-5">
                  <Link
                    href="/export/warehousing"
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#1B4F8B] no-underline transition-colors"
                  >
                    Classification &amp; warehousing (E07–E08)
                    <ArrowUpRight size={12} />
                  </Link>
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
