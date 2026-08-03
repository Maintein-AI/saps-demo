"use client";

/**
 * FC-02 §07–08 · AWB Summary Sheet — prepare, then verify against MAWB/HAWB.
 *
 * The gap this closes: `awb-summary` has existed in the lifecycle spine
 * since P0 (FC-01 §06, FC-02 Documentation lane) and **nothing rendered
 * it**. The flow ran OCR intake → indexation with the sheet skipped, which
 * quietly dropped the one reconciliation that sits between them.
 *
 * The sheet is a working document, not a stored table — CMTS has no
 * `AWBSUMMARY`, so this is greenfield. It is assembled from three sources
 * that are supposed to agree and frequently do not:
 *
 *   • the OCR-extracted line items from §06a–06d  (what the paper says)
 *   • the AWB header totals                        (what was keyed)
 *   • the manifest / FFM                           (what the airline sent)
 *
 * Preparing the sheet is the act of making those three reconcile. That is
 * why §08 "MAWB / HAWB verified" sits *after* §07 and *before* §09
 * indexation: classification is set at indexation, and setting it against
 * unreconciled totals is how a wrong class survives to the storage rules.
 *
 * A sheet that does not reconcile blocks release to indexation. The
 * declared-vs-physical variance is a different control and lives at §11
 * (`/import/acceptance`) — this one is paper-vs-paper.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Printer,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AuditStrip } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  cargoClass,
  cargoSubClass,
  formatDate,
  formatKg,
  getAwb,
  hasReached,
  listAwbs,
  round2,
} from "@/lib/domain";

/** A single paper-vs-paper reconciliation on the sheet. */
interface SheetCheck {
  group: "totals" | "manifest" | "documents";
  label: string;
  /** What the summary sheet carries. */
  sheet: string;
  /** What the source it is checked against carries. */
  against: string;
  againstLabel: string;
  matches: boolean;
}

export default function AwbSummarySheetPage() {
  const { scope, isHq } = useSite();

  // The sheet is prepared at §07, so it exists for anything that has
  // cleared document verification. Anything still at doc-verification is
  // queued for preparation rather than hidden.
  const rows = useMemo(
    () =>
      listAwbs({ scope })
        .filter((a) => hasReached(a.stage, "doc-verification"))
        .sort((a, b) => a.AWBNO.localeCompare(b.AWBNO)),
    [scope],
  );

  const [selected, setSelected] = useState<number | null>(null);
  const awbId = selected ?? rows[0]?.AWBId ?? null;
  const bundle = awbId !== null ? getAwb(awbId) : null;

  /** Every reconciliation for the selected AWB, computed not stored. */
  const checks = useMemo<SheetCheck[]>(() => {
    if (!bundle) return [];
    const { awb, details, manifest, houses, documents } = bundle;

    const lineP = details.reduce((s, d) => s + d.PCS, 0);
    const lineW = round2(details.reduce((s, d) => s + d.WEIGTH, 0));
    const lineC = round2(details.reduce((s, d) => s + d.CHARGEWEIGTH, 0));

    const out: SheetCheck[] = [
      {
        group: "totals",
        label: "Total pieces",
        sheet: String(awb.TOTALPCS),
        against: String(lineP),
        againstLabel: "Sum of line items",
        matches: awb.TOTALPCS === lineP,
      },
      {
        group: "totals",
        label: "Gross weight",
        sheet: formatKg(awb.TOTALWEIGHT),
        against: formatKg(lineW),
        againstLabel: "Sum of line items",
        matches: Math.abs(awb.TOTALWEIGHT - lineW) < 0.01,
      },
      {
        group: "totals",
        label: "Chargeable weight",
        sheet: formatKg(awb.TOTALCHRGWEIGHT),
        against: formatKg(lineC),
        againstLabel: "Sum of line items",
        matches: Math.abs(awb.TOTALCHRGWEIGHT - lineC) < 0.01,
      },
    ];

    if (manifest) {
      out.push(
        {
          group: "manifest",
          label: "IGM number",
          sheet: awb.IGMNO,
          against: manifest.IGMNO,
          againstLabel: "Manifest",
          matches: awb.IGMNO === manifest.IGMNO,
        },
        {
          group: "manifest",
          label: "Flight",
          sheet: awb.FLIGHT,
          against: manifest.FLIGHT,
          againstLabel: "Manifest / FFM",
          matches: awb.FLIGHT === manifest.FLIGHT,
        },
        {
          group: "manifest",
          label: "Origin",
          sheet: awb.ORIGIN,
          against: manifest.ORIGIN,
          againstLabel: "Manifest / FFM",
          matches: awb.ORIGIN === manifest.ORIGIN,
        },
        {
          group: "manifest",
          label: "Carrier",
          sheet: awb.ABBREVATION,
          against: manifest.ABBREVATION,
          againstLabel: "Manifest",
          matches: awb.ABBREVATION === manifest.ABBREVATION,
        },
      );
    }

    // §08 proper — the sheet is verified against the documents it was
    // built from. A consolidation with no HAWB on file cannot be verified,
    // however well its totals add up.
    const hasMawb = documents.some((d) => d.type === "MAWB");
    const hasHawb = documents.some((d) => d.type === "HAWB");
    out.push({
      group: "documents",
      label: "MAWB on file",
      sheet: hasMawb ? "Scanned at §06a" : "Missing",
      against: "Required",
      againstLabel: "§08 verification",
      matches: hasMawb,
    });
    if (awb.IsHwb) {
      out.push(
        {
          group: "documents",
          label: "HAWB on file",
          sheet: hasHawb ? "Scanned at §06a" : "Missing",
          against: "Required for consolidations",
          againstLabel: "§08 verification",
          matches: hasHawb,
        },
        {
          group: "documents",
          label: "House AWBs indexed",
          sheet: String(houses.length),
          against: houses.length > 0 ? "≥ 1" : "≥ 1",
          againstLabel: "Consolidation (FC-01 §11)",
          matches: houses.length > 0,
        },
      );
    }

    return out;
  }, [bundle]);

  const failed = checks.filter((c) => !c.matches);
  const reconciled = checks.length > 0 && failed.length === 0;

  // Queue counts across the whole scope, so the header is about the work
  // outstanding rather than about whichever row happens to be selected.
  const awaiting = rows.filter((a) => a.stage === "doc-verification").length;
  const prepared = rows.filter((a) => hasReached(a.stage, "awb-summary")).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import" }, { label: "AWB Summary Sheet" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M03
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              FC-02 §07–08 · FC-01 §06
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GREENFIELD
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            AWB Summary Sheet
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The sheet prepared between OCR intake and indexation — where the scanned paper, the
            keyed totals and the manifest are made to agree.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] px-5 py-4 flex items-start gap-3">
        <Layers size={17} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#7C3AED]">
            Why this sits before indexation
          </p>
          <p className="text-[12px] text-[#4C1D95] mt-1 leading-relaxed">
            Cargo class and subclass are set at <strong>§09 Indexation</strong>, and FC-03 drives
            rack allocation from them. Setting a class against totals that have not been reconciled
            is how a wrong class reaches the storage rules and stays there. So the sheet reconciles
            first, and a sheet that fails blocks release to indexation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "In scope", value: String(rows.length), tone: "#0F172A" },
          { label: "Awaiting preparation", value: String(awaiting), tone: "#D97706" },
          { label: "Sheet prepared", value: String(prepared), tone: "#16A34A" },
          {
            label: "Checks failing (selected)",
            value: String(failed.length),
            tone: failed.length ? "#DC2626" : "#16A34A",
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

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing has cleared document verification"
          description="The summary sheet is prepared at §07, once OCR intake has committed its line items."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Queue */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <FileSpreadsheet size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Sheets</h3>
            </div>
            <div className="max-h-[620px] overflow-y-auto">
              {rows.map((a) => {
                const isPrepared = hasReached(a.stage, "awb-summary");
                return (
                  <button
                    key={a.AWBId}
                    onClick={() => setSelected(a.AWBId)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: awbId === a.AWBId ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        {a.AWBNO}
                      </span>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center flex-shrink-0"
                        style={{
                          backgroundColor: isPrepared ? "#DCFCE7" : "#FEF3C7",
                          color: isPrepared ? "#16A34A" : "#D97706",
                        }}
                      >
                        {isPrepared ? "PREPARED" : "AWAITING"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {a.ORIGIN} → {a.DESTINATION} · {a.FLIGHT} · {a.TOTALPCS} pcs
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">{a.CONSIGNEE1}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The sheet */}
          {bundle && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      Summary sheet — {bundle.awb.AWBNO}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Assembled from the §06 intake, not stored — CMTS has no summary table.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#F1F5F9] text-[12px] font-semibold text-[#64748B]">
                      <Printer size={13} />
                      Print sheet
                    </span>
                    <AwbLink awbNo={bundle.awb.AWBNO} awbId={bundle.awb.AWBId}>
                      <span className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#1B4F8B] transition-colors">
                        Open AWB
                        <ArrowUpRight size={12} />
                      </span>
                    </AwbLink>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 border-b border-[#F1F5F9]">
                  {(
                    [
                      ["AWB no.", bundle.awb.AWBNO],
                      ["IGM no.", bundle.awb.IGMNO],
                      ["Flight", bundle.awb.FLIGHT],
                      ["Cargo date", formatDate(bundle.awb.CARGODATE)],
                      ["Route", `${bundle.awb.ORIGIN} → ${bundle.awb.DESTINATION}`],
                      ["Airline", bundle.awb.AIRLINENAME],
                      ["Shipper", bundle.awb.SHIPPER1],
                      ["Consignee", bundle.awb.CONSIGNEE1],
                      [
                        "Class (set at §09)",
                        `${cargoClass(bundle.awb.CARGOCLASSID)?.DESCRIPTION ?? "—"} · ${
                          cargoSubClass(bundle.awb.cargoSubClassId)?.DESCRIPTION ?? "—"
                        }`,
                      ],
                      ["Shipment type", bundle.awb.SHIPMENTTYPE],
                      ["Consolidation", bundle.awb.IsHwb ? `Yes — ${bundle.houses.length} HAWB` : "No"],
                      ["Sheet status", hasReached(bundle.awb.stage, "awb-summary") ? "Prepared" : "Awaiting preparation"],
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

                {/* Line items — declared, straight off the §06 intake */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead className="bg-[#F8FAFC] text-[#64748B]">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-semibold">Seq</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Nature of goods</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Pack</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Pieces</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Gross wt</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Chargeable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bundle.details.map((d) => (
                        <tr key={d.DetailId} className="border-t border-[#F1F5F9]">
                          <td className="px-4 py-2.5 font-mono text-[#94A3B8]">{d.SEQUENCE}</td>
                          <td className="px-4 py-2.5 text-[#0F172A]">{d.GOODS}</td>
                          <td className="px-4 py-2.5 text-[#64748B]">{d.TYPEOFPACK ?? "—"}</td>
                          <td className="px-4 py-2.5 text-right text-[#0F172A]">{d.PCS}</td>
                          <td className="px-4 py-2.5 text-right text-[#0F172A]">
                            {formatKg(d.WEIGTH)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-[#0F172A]">
                            {formatKg(d.CHARGEWEIGTH)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] font-semibold">
                        <td className="px-4 py-2.5" colSpan={3}>
                          Sheet total
                        </td>
                        <td className="px-4 py-2.5 text-right">{bundle.awb.TOTALPCS}</td>
                        <td className="px-4 py-2.5 text-right">
                          {formatKg(bundle.awb.TOTALWEIGHT)}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {formatKg(bundle.awb.TOTALCHRGWEIGHT)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* §08 — verification */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    §08 — verified against MAWB / HAWB and the manifest
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Paper vs paper. Declared-vs-physical is a separate control at §11.
                  </p>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div
                    className="rounded-xl border p-4 flex items-start gap-3"
                    style={{
                      borderColor: reconciled ? "#BBF7D0" : "#FCA5A5",
                      backgroundColor: reconciled ? "#F0FDF4" : "#FEF2F2",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: reconciled ? "#DCFCE7" : "#FEE2E2" }}
                    >
                      {reconciled ? (
                        <CheckCircle2 size={16} className="text-[#16A34A]" strokeWidth={2.5} />
                      ) : (
                        <XCircle size={16} className="text-[#DC2626]" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        {reconciled
                          ? `Sheet reconciles on all ${checks.length} checks — release to indexation`
                          : `${failed.length} of ${checks.length} checks failing — indexation blocked`}
                      </p>
                      <p className="text-[12px] text-[#64748B] mt-0.5">
                        {reconciled
                          ? "Class and subclass can be set at §09 against totals that agree."
                          : "Resolve the failing checks below, or raise a CDR if the paper itself is wrong."}
                      </p>
                    </div>
                    {reconciled && (
                      <Link
                        href="/import/indexing"
                        className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[#BBF7D0] bg-white hover:bg-[#F0FDF4] text-[12px] font-semibold text-[#16A34A] no-underline transition-colors flex-shrink-0"
                      >
                        Go to §09
                        <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </div>

                  {(["totals", "manifest", "documents"] as const).map((group) => {
                    const g = checks.filter((c) => c.group === group);
                    if (g.length === 0) return null;
                    const title =
                      group === "totals"
                        ? "Sheet totals vs its own line items"
                        : group === "manifest"
                          ? "Sheet vs manifest / FFM"
                          : "Source documents on file";
                    return (
                      <div key={group} className="flex flex-col gap-2">
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                          {title}
                        </p>
                        {g.map((c) => (
                          <div
                            key={c.label}
                            className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
                            style={{
                              borderColor: c.matches ? "#E2E8F0" : "#FCA5A5",
                              backgroundColor: c.matches ? "#FFFFFF" : "#FEF2F2",
                            }}
                          >
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-[#0F172A]">{c.label}</p>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                {c.againstLabel}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                                  Sheet
                                </p>
                                <p className="text-[13px] font-medium text-[#0F172A]">{c.sheet}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                                  Source
                                </p>
                                <p className="text-[13px] font-medium text-[#0F172A]">
                                  {c.against}
                                </p>
                              </div>
                              {c.matches ? (
                                <CheckCircle2 size={18} className="text-[#16A34A]" />
                              ) : (
                                <XCircle size={18} className="text-[#DC2626]" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <AuditStrip record={bundle.awb} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
