"use client";

/**
 * P9-4 / P9-5 · ULD build-up against the PFM, Discrepancy Note, PSW export
 * declaration, and the ramp-handover gate.
 *
 * None of this has a CMTS field. `ExportGodownrent` (53) exists for the
 * charging side, and that is the whole legacy inheritance.
 *
 * The FC-11 amendments:
 *   • **ULD build verified against the PFM / load plan** → missing / excess →
 *     ULD Build-up Report + Discrepancy Note. A build that silently differs
 *     from the load plan is how weight-and-balance goes wrong.
 *   • **SD + Form-E (EFE) via PSW EDI, PSW-primary day one.** Unlike the
 *     import side there is no WeBOC parallel run to fall back on.
 *
 * The ramp gate is the point: screening, seal, custody, declaration and
 * build are each independently regulated. Passing four of five is not
 * "nearly ready" — it is not ready.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  FileWarning,
  Landmark,
  PlaneTakeoff,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import StageRail, { type RailStep } from "@/components/exceptions/StageRail";
import { DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  EXPORT_STAGE_LABEL,
  EXPORT_STAGE_ORDER,
  formatDate,
  formatDateTime,
  formatKg,
  formatPkr,
  listExports,
  rampGateFor,
} from "@/lib/domain";

const DISC_TONE: Record<string, { bg: string; fg: string }> = {
  missing: { bg: "#FEE2E2", fg: "#DC2626" },
  excess: { bg: "#FEF3C7", fg: "#D97706" },
  "weight-variance": { bg: "#F5F3FF", fg: "#7C3AED" },
};

export default function ExportBuildupPage() {
  const { scope, isHq } = useSite();
  const consignments = useMemo(() => listExports(scope), [scope]);

  const [selected, setSelected] = useState<number | null>(consignments[0]?.id ?? null);
  const c = consignments.find((x) => x.id === selected) ?? consignments[0] ?? null;
  const gate = c ? rampGateFor(c.id) : null;

  const rail: RailStep[] = c
    ? EXPORT_STAGE_ORDER.map((s) => ({
        key: s,
        label: EXPORT_STAGE_LABEL[s],
        detail:
          s === "E04-weighed" && c.weighment
            ? `${formatKg(c.weighment.netKg)} net · scale ${c.weighment.scaleId}`
            : s === "E06-screened" && c.screening.length
              ? `${c.screening[0].result} · seal ${c.screening[0].sealNo ?? "—"}`
              : s === "E09-built-up" && c.pfm.length
                ? `${c.pfm.length} ULD(s)`
                : s === "E11-handed-to-ramp" && c.flightNo
                  ? `${c.flightNo} · ${c.scheduledDeparture ? formatDate(c.scheduledDeparture) : "TBC"}`
                  : null,
      }))
    : [];

  const withDisc = consignments.filter((x) => (rampGateFor(x.id)?.discrepancies.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Export" }, { label: "Build-up & Declaration" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              FC-11 §E09–E12
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              PFM · Discrepancy Note · PSW export SD
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Build-up, Declaration &amp; Ramp Gate
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The build verified against the load plan, and the five conditions that gate going
            airside.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Consignments", value: String(consignments.length), tone: "#0F172A" },
          {
            label: "Ready for ramp",
            value: String(consignments.filter((x) => rampGateFor(x.id)?.canHandOver).length),
            tone: "#16A34A",
          },
          { label: "With discrepancies", value: String(withDisc.length), tone: "#DC2626" },
          {
            label: "Declarations cleared",
            value: String(consignments.filter((x) => x.declaration.clearedAt).length),
            tone: "#1B4F8B",
          },
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

      {consignments.length === 0 ? (
        <EmptyState title="No export consignments at this site" description="Build-up follows acceptance and screening." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Boxes size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Consignments</h3>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {consignments.map((x) => {
                const g = rampGateFor(x.id);
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
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center"
                        style={
                          g?.canHandOver
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {g?.canHandOver ? "READY" : `${g?.blockedBy.length ?? 0} BLOCK`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {x.flightNo ?? "no flight"} · {x.acceptance.DESTINATION}
                    </p>
                    {x.discrepancyNoteNo && (
                      <span className="h-[16px] px-1.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[9px] font-bold inline-flex items-center mt-1">
                        {x.discrepancyNoteNo}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {c && gate && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Ramp gate */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Ramp handover gate — §E11
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        Five independently regulated conditions
                      </p>
                    </div>
                  </div>
                  <span
                    className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                    style={
                      gate.canHandOver
                        ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                        : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                    }
                  >
                    {gate.canHandOver ? "CLEARED FOR RAMP" : "BLOCKED"}
                  </span>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {gate.conditions.map((x) => (
                    <div key={x.code} className="px-5 py-3 flex items-start gap-2.5">
                      {x.pass ? (
                        <CheckCircle2 size={15} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={15} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#0F172A]">{x.label}</p>
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: x.pass ? "#64748B" : "#991B1B" }}
                        >
                          {x.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <StageRail
                  steps={rail}
                  currentKey={c.stage}
                  title="FC-11 progress"
                  tone="#7C3AED"
                  note="Greenfield beyond E02–E04 — no CMTS table backs E06 onward."
                />

                {/* PSW export declaration */}
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                    <Landmark size={15} className="text-[#64748B]" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Export declaration — PSW
                      </h3>
                      <p className="text-[11px] text-[#94A3B8]">
                        PSW-primary day one — no WeBOC fallback on export
                      </p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-x-5 gap-y-4">
                    {(
                      [
                        ["sdRef", c.declaration.sdRef],
                        ["sdLodgedAt", c.declaration.sdLodgedAt ? formatDate(c.declaration.sdLodgedAt) : null],
                        ["formERef", c.declaration.formERef],
                        ["formEBank", c.declaration.formEBank],
                        ["formEValue", formatPkr(c.declaration.formEValue)],
                        ["formEExpiry", c.declaration.formEExpiry ? formatDate(c.declaration.formEExpiry) : null],
                        ["pswAckRef", c.declaration.pswAckRef],
                        ["clearedAt", c.declaration.clearedAt ? formatDate(c.declaration.clearedAt) : null],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                        <span
                          className="text-[12px] font-medium break-words"
                          style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                        >
                          {v ?? "null"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {c.declaration.rejectionCode && (
                    <div className="px-5 py-3 bg-[#FEF2F2] border-t border-[#FECACA]">
                      <p className="text-[12px] text-[#991B1B]">
                        <span className="font-mono font-semibold">{c.declaration.rejectionCode}</span>{" "}
                        — {c.declaration.rejectionText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PFM build verification */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    ULD build verified against the PFM
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Planned vs actual, per ULD. A silent difference is how weight-and-balance goes
                    wrong.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        {["ULD", "Type", "Planned pcs", "Built pcs", "Planned kg", "Built kg", "AWBs built", "Built by"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.pfm.map((l) => {
                        const off = l.actualPieces !== l.plannedPieces ||
                          l.actualAwbs.length !== l.plannedAwbs.length;
                        return (
                          <tr
                            key={l.uldNo}
                            className="border-b border-[#F1F5F9] last:border-0"
                            style={{ backgroundColor: off ? "#FEF2F2" : undefined }}
                          >
                            <td className="px-4 py-2.5 font-mono text-[12px] font-semibold text-[#0F172A]">
                              {l.uldNo}
                            </td>
                            <td className="px-4 py-2.5 text-[12px] text-[#475569]">{l.uldType}</td>
                            <td className="px-4 py-2.5 font-mono text-[12px] text-[#475569]">
                              {l.plannedPieces}
                            </td>
                            <td
                              className="px-4 py-2.5 font-mono text-[12px] font-semibold"
                              style={{ color: off ? "#DC2626" : "#0F172A" }}
                            >
                              {l.actualPieces}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatKg(l.plannedWeightKg)}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                              {formatKg(l.actualWeightKg)}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[10px] text-[#64748B]">
                              {l.actualAwbs.join(", ")}
                            </td>
                            <td className="px-4 py-2.5 text-[11px] text-[#94A3B8] whitespace-nowrap">
                              {l.builtBy ?? "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discrepancy note */}
              {gate.discrepancies.length > 0 && (
                <div className="rounded-[16px] border border-[#FCA5A5] bg-[#FEF2F2] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#FCA5A5] flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <FileWarning size={15} className="text-[#DC2626]" />
                      <h3 className="text-[14px] font-semibold text-[#DC2626]">
                        Discrepancy Note required
                      </h3>
                    </div>
                    {c.discrepancyNote && <DocNumber doc={c.discrepancyNote} />}
                  </div>
                  <div className="divide-y divide-[#FECACA]">
                    {gate.discrepancies.map((d, i) => {
                      const tone = DISC_TONE[d.kind];
                      return (
                        <div key={i} className="px-5 py-3 flex items-start gap-3">
                          <span
                            className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center uppercase flex-shrink-0"
                            style={{ backgroundColor: tone.bg, color: tone.fg }}
                          >
                            {d.kind}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-[#0F172A]">
                              {d.uldNo}
                              {d.awbNo ? ` · ${d.awbNo}` : ""}
                            </p>
                            <p className="text-[12px] text-[#991B1B] mt-0.5">{d.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-5 py-3 bg-white border-t border-[#FECACA]">
                    <p className="text-[11px] text-[#64748B]">
                      The ULD Build-up Report and this Discrepancy Note go to the carrier together.
                      The build cannot be handed to the ramp until the note is resolved or the load
                      plan is amended.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/export/acceptance"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Acceptance &amp; screening <ArrowUpRight size={12} />
                </Link>
                <Link
                  href="/messaging/iata"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  FFM / FWB / FHL transmission <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
