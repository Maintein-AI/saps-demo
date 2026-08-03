"use client";

/**
 * P9-2 / P9-3 · Export acceptance, weighment, screening & chain of custody.
 *
 * CMTS gives `CARGOACCEPTANCE` (31) and `ACCEPTENCEDETAIL` (10) — and stops.
 * It has LOADEDWEIGHT / UNLOADEDWEIGHT / LEASHINGWEIGHT / PALLETWEIGHT but
 * nothing saying where the numbers came from, and **no field anywhere** for
 * screening, seals or custody.
 *
 * Two amendments do the work here:
 *
 *   • **Weighing-scale integration.** A weight that was auto-captured has a
 *     provenance and a tolerance. A weight that was typed has neither, and
 *     the declared-vs-actual variance is exactly the number a shipper has an
 *     incentive to get wrong.
 *
 *   • **Tamper-evident record + chain of custody (ACC3 / known-consignor).**
 *     Screening is a regulated act attributable to a named screener, and the
 *     seal applied after it has to survive every handover. A broken seal at
 *     any handover sends the consignment back to screening — it does not
 *     merely get noted.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardCheck,
  Scale,
  ScanLine,
  ShieldCheck,
  ShieldX,
  Truck,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { AuditStrip, FormField, FormCompletenessGate } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  EXPORT_STAGE_LABEL,
  SCREENING_METHOD_LABEL,
  VARIANCE_TOLERANCE,
  formatDate,
  formatDateTime,
  formatKg,
  listExports,
} from "@/lib/domain";

export default function ExportAcceptancePage() {
  const { scope, isHq } = useSite();
  const consignments = useMemo(() => listExports(scope), [scope]);

  const [selected, setSelected] = useState<number | null>(consignments[0]?.id ?? null);
  const c = consignments.find((x) => x.id === selected) ?? consignments[0] ?? null;
  const [tab, setTab] = useState<"acceptance" | "weighment" | "screening">("acceptance");

  const brokenCustody = consignments.filter((x) =>
    x.custodyChain.some((e) => e.sealIntact === false),
  );
  const outOfTolerance = consignments.filter((x) => x.weighment && !x.weighment.withinTolerance);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Export" }, { label: "Acceptance & Screening" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              FC-11 §E02–E06
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              CARGOACCEPTANCE 31 · ACCEPTENCEDETAIL 10
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GREENFIELD
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Export Acceptance &amp; Screening
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Scale-captured weights, regulated screening, and a custody chain CMTS has no field for.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Consignments", value: String(consignments.length), tone: "#0F172A" },
          { label: "Broken seals", value: String(brokenCustody.length), tone: "#DC2626" },
          { label: "Weight out of tolerance", value: String(outOfTolerance.length), tone: "#D97706" },
          {
            label: "Screened & sealed",
            value: String(consignments.filter((x) => x.screening.some((s) => s.sealNo)).length),
            tone: "#16A34A",
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
        <EmptyState
          title="No export consignments at this site"
          description="FC-11 starts at booking; acceptance is §E02 at the export counter."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Truck size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Export consignments</h3>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {consignments.map((x) => {
                const broken = x.custodyChain.some((e) => e.sealIntact === false);
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
                      {broken && (
                        <span className="h-[18px] px-1.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[9px] font-bold inline-flex items-center">
                          SEAL BROKEN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {x.acceptance.DESTINATION} · {x.acceptance.AIRLINEABB} ·{" "}
                      {x.acceptance.PCSAWB} pcs
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                      {EXPORT_STAGE_LABEL[x.stage]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {c && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="font-mono text-[15px] font-bold text-[#0F172A]">
                      {c.awbNo}
                    </span>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      {c.acceptance.SHIPPERNAME} → {c.acceptance.CONSIGNEENAME} ·{" "}
                      {c.acceptance.ORIGIN} → {c.acceptance.DESTINATION}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-[22px] px-2.5 rounded-full bg-[#EBF0F7] text-[#1B4F8B] text-[10px] font-bold inline-flex items-center">
                      {c.custodyRegime}
                    </span>
                    <span className="h-[22px] px-2.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center">
                      {c.acceptance.PAYMENT}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    ["acceptance", "Acceptance (31 cols)"],
                    ["weighment", "Weighment"],
                    ["screening", `Screening & custody (${c.custodyChain.length})`],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setTab(v)}
                    className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer"
                    style={{
                      backgroundColor: tab === v ? "#0B2545" : "#FFFFFF",
                      color: tab === v ? "#FFFFFF" : "#475569",
                      borderColor: tab === v ? "#0B2545" : "#E2E8F0",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "acceptance" && (
                <>
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                      <ClipboardCheck size={15} className="text-[#64748B]" />
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        CARGOACCEPTANCE — all 31 columns
                      </h3>
                    </div>
                    <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                      {(Object.entries(c.acceptance) as Array<[string, unknown]>).map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                          <span
                            className="text-[12px] font-medium break-words"
                            style={{ color: v === null || v === "" ? "#CBD5E1" : "#0F172A" }}
                          >
                            {v === null || v === "" ? "null" : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Export documents — keyed at the counter
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        The shipper hands paper across the counter and the clerk types it. No
                        scanner in this loop — OCR is inbound MAWB/HAWB and receiver docs only.
                      </p>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      <FormCompletenessGate
                        total={c.capturedDocs.length}
                        outstanding={c.capturedDocs.filter((d) => !d.value.verifiedBy).length}
                        context="Every document is countersigned by the acceptance supervisor before the consignment moves to weighment."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {c.capturedDocs.map((d) => (
                          <div key={d.label} className="rounded-xl border border-[#E2E8F0] px-4 py-3">
                            <FormField label={d.label} value={d.value} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === "weighment" && c.weighment && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Scale size={15} className="text-[#64748B]" />
                      <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">
                          Weighment — scale {c.weighment.scaleId}
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          {formatDateTime(c.weighment.weighedAt)} · {c.weighment.weighedBy}
                        </p>
                      </div>
                    </div>
                    <span
                      className="h-[22px] px-2.5 rounded-full text-[10px] font-bold inline-flex items-center"
                      style={
                        c.weighment.autoCaptured
                          ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                          : { backgroundColor: "#FEF3C7", color: "#D97706" }
                      }
                    >
                      {c.weighment.autoCaptured ? "AUTO-CAPTURED" : "MANUAL ENTRY"}
                    </span>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      ["Gross", formatKg(c.weighment.grossKg), "#0F172A"],
                      ["Tare", formatKg(c.weighment.tareKg), "#64748B"],
                      ["Net", formatKg(c.weighment.netKg), "#1B4F8B"],
                      ["Pallet", formatKg(c.weighment.palletKg), "#64748B"],
                      ["Lashing", formatKg(c.weighment.lashingKg), "#64748B"],
                      ["Declared", formatKg(c.weighment.declaredKg), "#7C3AED"],
                    ].map(([l, v, tone]) => (
                      <div key={l} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          {l}
                        </p>
                        <p className="text-[16px] font-bold mt-0.5 font-mono" style={{ color: tone }}>
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="px-5 py-3.5 border-t"
                    style={{
                      backgroundColor: c.weighment.withinTolerance ? "#F0FDF4" : "#FFFBEB",
                      borderColor: c.weighment.withinTolerance ? "#BBF7D0" : "#FDE68A",
                    }}
                  >
                    <p
                      className="text-[12px] font-semibold"
                      style={{ color: c.weighment.withinTolerance ? "#16A34A" : "#D97706" }}
                    >
                      Declared vs actual: {c.weighment.varianceKg > 0 ? "+" : ""}
                      {formatKg(c.weighment.varianceKg)} (
                      {(c.weighment.varianceRatio * 100).toFixed(2)}%) —{" "}
                      {c.weighment.withinTolerance
                        ? `within the ${(VARIANCE_TOLERANCE * 100).toFixed(0)}% tolerance`
                        : `outside the ${(VARIANCE_TOLERANCE * 100).toFixed(0)}% tolerance`}
                    </p>
                    {!c.weighment.withinTolerance && (
                      <p className="text-[11px] text-[#92400E] mt-1">
                        Chargeable weight is billed on the actual, not the declared. A variance this
                        size is worth querying with the shipper before the AWB is issued — it is the
                        number they have most incentive to understate.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tab === "screening" && (
                <>
                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                      <ScanLine size={15} className="text-[#64748B]" />
                      <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">
                          Security screening
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Attributable to a named screener — a regulated record, not a shift note
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-[#F1F5F9]">
                      {c.screening.map((s) => (
                        <div key={s.id} className="px-5 py-3.5">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              {s.result === "pass" ? (
                                <ShieldCheck size={14} className="text-[#16A34A]" />
                              ) : (
                                <ShieldX size={14} className="text-[#DC2626]" />
                              )}
                              <span className="text-[13px] font-semibold text-[#0F172A]">
                                {SCREENING_METHOD_LABEL[s.method]}
                              </span>
                              <span
                                className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                                style={
                                  s.result === "pass"
                                    ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                    : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                                }
                              >
                                {s.result}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#94A3B8]">
                              {formatDateTime(s.screenedAt)}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#475569] mt-1">
                            {s.piecesScreened} pieces · screener {s.screenerName} ({s.screenerId})
                          </p>
                          {s.sealNo && (
                            <p className="text-[11px] text-[#15803D] mt-1 font-mono">
                              Seal {s.sealNo} applied {s.sealAppliedAt ? formatDate(s.sealAppliedAt) : ""}
                              {s.sealRfid ? ` · RFID ${s.sealRfid}` : ""}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">
                        Chain of custody — {c.custodyRegime}
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Every handover verifies the seal. CMTS has no field for any of this.
                      </p>
                    </div>
                    <div className="divide-y divide-[#F1F5F9]">
                      {c.custodyChain.map((e) => (
                        <div
                          key={e.id}
                          className="px-5 py-3.5"
                          style={{ backgroundColor: e.sealIntact === false ? "#FEF2F2" : undefined }}
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-[13px] font-medium text-[#0F172A]">
                                {e.fromParty} → {e.toParty}
                              </p>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                {e.location} · signed {e.signedBy}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {e.sealIntact !== null && (
                                <span
                                  className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center"
                                  style={
                                    e.sealIntact
                                      ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                      : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                                  }
                                >
                                  {e.sealIntact ? "SEAL INTACT" : "SEAL BROKEN"}
                                </span>
                              )}
                              <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
                                {formatDateTime(e.at)}
                              </span>
                            </div>
                          </div>
                          {e.note && (
                            <p
                              className="text-[12px] mt-1"
                              style={{ color: e.sealIntact === false ? "#991B1B" : "#64748B" }}
                            >
                              {e.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {c.custodyChain.some((e) => e.sealIntact === false) && (
                      <div className="px-5 py-3 bg-[#FEF2F2] border-t border-[#FECACA]">
                        <p className="text-[12px] text-[#991B1B]">
                          A broken seal sends the consignment back to screening. It cannot go airside
                          on the strength of the earlier pass — the pass certified a state that no
                          longer holds.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/export/buildup"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Build-up, declaration &amp; ramp gate <ArrowUpRight size={12} />
                </Link>
              </div>

              <AuditStrip record={c} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
