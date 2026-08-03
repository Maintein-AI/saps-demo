"use client";

/**
 * P1-3 · OCR Intake Workbench — FC-01 steps 05a–05f.
 *
 * The single most important AirVault amendment, verbatim from FC-01:
 *
 *   "Step 05 is now OCR-assisted intake. • Per-item confidence score +
 *    operator acceptance before commit. • Declared (OCR) vs physical
 *    (received) variance feeds 07 Reconciliation → 08 → CDR (FC-04).
 *    CMTS parity to keep: chargeable weight, classification-at-intake,
 *    IGM / manifest linkage."
 *
 * The six sub-steps are the flow's own nodes:
 *   05a scan → 05b auto-extract with confidence → 05c acceptance gate
 *   → 05d correct low-confidence items (loops to 05c) → 05e declared vs
 *   physical → 05f commit
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileScan,
  PencilLine,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { OcrAcceptanceGate, OcrConfidenceField } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  CARGO_CLASSES,
  DOCUMENT_TYPE_LABEL,
  OCR_CONFIDENCE_THRESHOLD,
  VARIANCE_TOLERANCE,
  cargoSubClass,
  formatKg,
  listAwbs,
  round2,
  subClassesOf,
  variance,
  type OcrValue,
} from "@/lib/domain";

const STEPS = [
  { id: "05a", label: "Scan", icon: ScanLine, hint: "MAWB / HAWB / Manifest" },
  { id: "05b", label: "Extract", icon: Sparkles, hint: "Line items + confidence" },
  { id: "05c", label: "Accept", icon: ShieldCheck, hint: "Gate — all items confirmed" },
  { id: "05d", label: "Correct", icon: PencilLine, hint: "Low-confidence items only" },
  { id: "05e", label: "Declared vs physical", icon: FileScan, hint: "Capture what arrived" },
  { id: "05f", label: "Commit", icon: Check, hint: "Verified AWB summary" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WorkingLine {
  id: number;
  goods: OcrValue<string>;
  pcs: OcrValue<number>;
  weightKg: OcrValue<number>;
  volumeM3: OcrValue<number>;
  /** 05e — physically received. */
  receivedPcs: number;
  receivedWeightKg: number;
  receivedVolumeM3: number;
  confirmed: boolean;
}

export default function OcrIntakePage() {
  const { scope } = useSite();

  // Candidates: anything at or before AWB summary — the intake queue.
  const queue = useMemo(
    () => listAwbs({ scope }).filter((a) => ["handover", "doc-verification", "awb-summary", "reconciliation"].includes(a.stage)),
    [scope],
  );

  const [awbId, setAwbId] = useState<number | null>(queue[0]?.AWBId ?? null);
  const awb = queue.find((a) => a.AWBId === awbId) ?? queue[0] ?? null;

  const [step, setStep] = useState<StepId>("05a");
  const [scanned, setScanned] = useState(false);
  const [lines, setLines] = useState<WorkingLine[]>([]);
  const [classId, setClassId] = useState<number>(awb?.CARGOCLASSID ?? 1);
  const [subClassId, setSubClassId] = useState<number>(awb?.cargoSubClassId ?? 101);
  const [committed, setCommitted] = useState(false);

  // 05b — the extraction. Seeded from the AWB so the numbers are consistent
  // with the rest of the fixture set rather than invented per render.
  function runExtraction() {
    if (!awb) return;
    const n = 3;
    const confidences = [0.98, 0.74, 0.88];
    const built: WorkingLine[] = Array.from({ length: n }, (_, i) => {
      const pcs = Math.round(awb.TOTALPCS / n);
      const kg = round2(awb.TOTALWEIGHT / n);
      const vol = round2(kg / 167);
      const c = confidences[i];
      return {
        id: i + 1,
        goods: { extracted: ["Pharmaceutical preparations", "Cotton fabric rolls", "Consumer electronics"][i], value: ["Pharmaceutical preparations", "Cotton fabric rolls", "Consumer electronics"][i], confidence: c, state: c >= OCR_CONFIDENCE_THRESHOLD ? "auto-accepted" : "needs-review" },
        pcs: { extracted: pcs, value: pcs, confidence: Math.min(0.99, c + 0.05), state: Math.min(0.99, c + 0.05) >= OCR_CONFIDENCE_THRESHOLD ? "auto-accepted" : "needs-review" },
        weightKg: { extracted: kg, value: kg, confidence: c, state: c >= OCR_CONFIDENCE_THRESHOLD ? "auto-accepted" : "needs-review" },
        volumeM3: { extracted: vol, value: vol, confidence: Math.max(0.6, c - 0.1), state: Math.max(0.6, c - 0.1) >= OCR_CONFIDENCE_THRESHOLD ? "auto-accepted" : "needs-review" },
        receivedPcs: pcs,
        receivedWeightKg: kg,
        receivedVolumeM3: vol,
        confirmed: c >= OCR_CONFIDENCE_THRESHOLD,
      };
    });
    setLines(built);
    setScanned(true);
    setStep("05b");
  }

  const outstanding = lines.filter((l) => !l.confirmed).length;
  const allAccepted = lines.length > 0 && outstanding === 0;

  function confirmLine(id: number) {
    setLines((ls) =>
      ls.map((l) =>
        l.id === id
          ? {
              ...l,
              confirmed: true,
              goods: { ...l.goods, state: "operator-corrected", correctedBy: "n.hassan" },
              weightKg: { ...l.weightKg, state: "operator-corrected", correctedBy: "n.hassan" },
              volumeM3: { ...l.volumeM3, state: "operator-corrected", correctedBy: "n.hassan" },
            }
          : l,
      ),
    );
  }

  function setReceived(id: number, field: "receivedPcs" | "receivedWeightKg" | "receivedVolumeM3", v: number) {
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, [field]: v } : l)));
  }

  // 05e — totals and variance
  const totals = useMemo(() => {
    const declaredPcs = lines.reduce((n, l) => n + l.pcs.value, 0);
    const physicalPcs = lines.reduce((n, l) => n + l.receivedPcs, 0);
    const declaredKg = round2(lines.reduce((n, l) => n + l.weightKg.value, 0));
    const physicalKg = round2(lines.reduce((n, l) => n + l.receivedWeightKg, 0));
    const declaredVol = round2(lines.reduce((n, l) => n + l.volumeM3.value, 0));
    const physicalVol = round2(lines.reduce((n, l) => n + l.receivedVolumeM3, 0));
    return {
      pieces: variance(declaredPcs, physicalPcs),
      weightKg: variance(declaredKg, physicalKg),
      volumeM3: variance(declaredVol, physicalVol),
    };
  }, [lines]);

  const overTolerance =
    totals.pieces.overTolerance || totals.weightKg.overTolerance || totals.volumeM3.overTolerance;

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  if (!awb) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "OCR Intake" }]} />
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#0F172A]">Intake queue is empty at {scope}</p>
          <p className="text-[13px] text-[#64748B] mt-1">
            Switch site in the header, or check the flight board for arriving cargo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "OCR Intake Workbench" }]} />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
                M02 → M03
              </span>
              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
                FC-01 05a–05f
              </span>
            </div>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
              OCR Intake Workbench
            </h1>
            <p className="text-[13px] text-[#64748B] mt-1">
              Scan, auto-extract with per-item confidence, correct only what needs it, then record
              what physically arrived.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Intake queue ({queue.length})
            </span>
            <select
              value={awbId ?? ""}
              onChange={(e) => {
                setAwbId(Number(e.target.value));
                setStep("05a");
                setScanned(false);
                setLines([]);
                setCommitted(false);
              }}
              className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer font-mono"
            >
              {queue.map((a) => (
                <option key={a.AWBId} value={a.AWBId}>
                  {a.AWBNO} — {a.stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = s.id === step;
            const reachable = scanned || s.id === "05a";
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  disabled={!reachable}
                  onClick={() => reachable && setStep(s.id)}
                  className="flex flex-col items-center gap-1.5 min-w-[104px] px-2 py-1 rounded-lg transition-colors"
                  style={{ cursor: reachable ? "pointer" : "not-allowed", opacity: reachable ? 1 : 0.45 }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: active ? "#0B2545" : done ? "#16A34A" : "#F1F5F9",
                      color: active || done ? "white" : "#94A3B8",
                    }}
                  >
                    <s.icon size={16} />
                  </div>
                  <span
                    className="text-[11px] font-mono font-bold"
                    style={{ color: active ? "#0B2545" : done ? "#16A34A" : "#94A3B8" }}
                  >
                    {s.id}
                  </span>
                  <span
                    className="text-[11px] text-center leading-tight"
                    style={{ color: active ? "#0B2545" : "#64748B", fontWeight: active ? 700 : 500 }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-6 h-[2px] flex-shrink-0"
                    style={{ backgroundColor: done ? "#16A34A" : "#E2E8F0" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AWB context */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
          {[
            ["AWB", awb.AWBNO],
            ["IGM", awb.IGMNO],
            ["Flight", awb.FLIGHT],
            ["Declared pieces", String(awb.TOTALPCS)],
            ["Declared weight", formatKg(awb.TOTALWEIGHT)],
          ].map(([l, v]) => (
            <div key={l} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                {l}
              </span>
              <span className="text-[13px] font-semibold text-[#0F172A] font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- 05a Scan ---- */}
      {step === "05a" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">05a · Scan documents</h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            MAWB, HAWB and manifest from the flight pouch. Scanner source, not a file upload.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {(["MAWB", "HAWB", "MANIFEST"] as const).map((t) => (
              <div
                key={t}
                className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 flex flex-col items-center gap-2"
              >
                <ScanLine size={24} className="text-[#94A3B8]" />
                <p className="text-[13px] font-semibold text-[#0F172A]">{DOCUMENT_TYPE_LABEL[t]}</p>
                <p className="text-[11px] text-[#94A3B8]">Feeder scanner — Canon DR-G2140</p>
              </div>
            ))}
          </div>

          <button
            onClick={runExtraction}
            className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#1B4F8B] transition-colors"
          >
            <Sparkles size={15} />
            Scan &amp; extract
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ---- 05b Extract + 05c gate ---- */}
      {(step === "05b" || step === "05c") && (
        <div className="flex flex-col gap-5">
          <OcrAcceptanceGate total={lines.length} outstanding={outstanding} />

          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-[16px] font-semibold text-[#0F172A]">
                  05b · Extracted line items
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1">
                  Item, category, quantity, volume and weight — each with a confidence score against
                  a {Math.round(OCR_CONFIDENCE_THRESHOLD * 100)}% threshold.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 mt-5">
              {lines.map((l) => (
                <div
                  key={l.id}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: l.confirmed ? "#E2E8F0" : "#FDE68A",
                    backgroundColor: l.confirmed ? "white" : "#FFFBEB",
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[12px] font-bold text-[#64748B]">Line {l.id}</span>
                    {l.confirmed ? (
                      <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#DCFCE7] text-[#16A34A]">
                        Confirmed
                      </span>
                    ) : (
                      <button
                        onClick={() => confirmLine(l.id)}
                        className="h-8 px-3 rounded-lg bg-[#D97706] text-white text-[12px] font-semibold cursor-pointer hover:bg-[#B45309] transition-colors"
                      >
                        Review &amp; confirm
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <OcrConfidenceField label="Goods" value={l.goods} />
                    <OcrConfidenceField label="Pieces" value={l.pcs} />
                    <OcrConfidenceField label="Gross weight" value={l.weightKg} suffix="kg" />
                    <OcrConfidenceField label="Volume" value={l.volumeM3} suffix="m³" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E2E8F0]">
              {!allAccepted && (
                <button
                  onClick={() => setStep("05d")}
                  className="h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  Open correction mode (05d)
                </button>
              )}
              <button
                disabled={!allAccepted}
                onClick={() => setStep("05e")}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold transition-colors"
                style={{
                  backgroundColor: allAccepted ? "#0B2545" : "#F1F5F9",
                  color: allAccepted ? "white" : "#94A3B8",
                  cursor: allAccepted ? "pointer" : "not-allowed",
                }}
              >
                Continue to 05e
                <ArrowRight size={15} />
              </button>
              {!allAccepted && (
                <span className="text-[12px] text-[#D97706]">
                  Blocked — {outstanding} item{outstanding === 1 ? "" : "s"} below threshold and
                  unconfirmed (FC-01 05c)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- 05d Correction ---- */}
      {step === "05d" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">
            05d · Correct low-confidence items
          </h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Only items below threshold appear here. Confirming returns to the 05c gate — the flow&rsquo;s
            own loop.
          </p>

          {outstanding === 0 ? (
            <div className="mt-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 text-center">
              <p className="text-[13px] font-semibold text-[#16A34A]">
                Nothing left to correct — all items confirmed
              </p>
              <button
                onClick={() => setStep("05c")}
                className="mt-3 h-9 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold cursor-pointer"
              >
                Back to 05c gate
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-5">
              {lines
                .filter((l) => !l.confirmed)
                .map((l) => (
                  <div key={l.id} className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[12px] font-bold text-[#D97706]">
                        Line {l.id} — needs review
                      </span>
                      <button
                        onClick={() => {
                          confirmLine(l.id);
                          if (outstanding === 1) setStep("05c");
                        }}
                        className="h-8 px-3 rounded-lg bg-[#0B2545] text-white text-[12px] font-semibold cursor-pointer"
                      >
                        Confirm line
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <OcrConfidenceField label="Goods" value={l.goods} onCorrect={() => confirmLine(l.id)} />
                      <OcrConfidenceField label="Pieces" value={l.pcs} />
                      <OcrConfidenceField label="Gross weight" value={l.weightKg} suffix="kg" onCorrect={() => confirmLine(l.id)} />
                      <OcrConfidenceField label="Volume" value={l.volumeM3} suffix="m³" onCorrect={() => confirmLine(l.id)} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ---- 05e Declared vs physical ---- */}
      {step === "05e" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
            <h2 className="text-[16px] font-semibold text-[#0F172A]">
              05e · Declared (OCR) vs physical (received)
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1">
              Variance over {Math.round(VARIANCE_TOLERANCE * 100)}% auto-raises a CDR at FC-04. Maps
              onto the CMTS pairs PCS/RECEIVEDPCS, WEIGTH/RECEIVEDWT, CHARGEWEIGTH/CHARGEDRECEIVEDWT.
            </p>

            <div className="overflow-x-auto mt-5">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">
                    <th className="text-left px-3 py-2">Line</th>
                    <th className="text-right px-3 py-2">Declared pcs</th>
                    <th className="text-right px-3 py-2">Received pcs</th>
                    <th className="text-right px-3 py-2">Declared kg</th>
                    <th className="text-right px-3 py-2">Received kg</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => (
                    <tr key={l.id} className="border-b border-[#F1F5F9]">
                      <td className="px-3 py-2.5 font-medium">{l.goods.value}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-[#64748B]">{l.pcs.value}</td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          value={l.receivedPcs}
                          onChange={(e) => setReceived(l.id, "receivedPcs", Number(e.target.value))}
                          className="w-20 h-8 px-2 rounded-lg border border-[#E2E8F0] text-right font-mono text-[13px] outline-none focus:border-[#2E75B6]"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-[#64748B]">
                        {l.weightKg.value}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          value={l.receivedWeightKg}
                          onChange={(e) =>
                            setReceived(l.id, "receivedWeightKg", Number(e.target.value))
                          }
                          className="w-24 h-8 px-2 rounded-lg border border-[#E2E8F0] text-right font-mono text-[13px] outline-none focus:border-[#2E75B6]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              {(
                [
                  ["Pieces", totals.pieces],
                  ["Weight (kg)", totals.weightKg],
                  ["Volume (m³)", totals.volumeM3],
                ] as const
              ).map(([label, v]) => (
                <div
                  key={label}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: v.overTolerance ? "#FECACA" : "#E2E8F0",
                    backgroundColor: v.overTolerance ? "#FEF2F2" : "white",
                  }}
                >
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    {label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[18px] font-bold text-[#0F172A] font-mono">
                      {v.physical}
                    </span>
                    <span className="text-[12px] text-[#94A3B8] font-mono">/ {v.declared}</span>
                  </div>
                  <p
                    className="text-[12px] font-semibold mt-1 font-mono"
                    style={{ color: v.overTolerance ? "#DC2626" : v.delta === 0 ? "#16A34A" : "#D97706" }}
                  >
                    {v.delta > 0 ? "+" : ""}
                    {v.delta} ({(v.ratio * 100).toFixed(1)}%)
                    {v.overTolerance ? " — over tolerance" : ""}
                  </p>
                </div>
              ))}
            </div>

            {overTolerance && (
              <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <p className="text-[13px] font-semibold text-[#DC2626]">
                  Variance exceeds tolerance — a CDR will be raised automatically on commit
                </p>
                <p className="text-[12px] text-[#991B1B] mt-1">
                  FC-04 amendment: Shortage / Overage / Wrong Weight fall straight out of intake, so
                  the discrepancy is caught here rather than waiting to be spotted.
                </p>
              </div>
            )}

            <button
              onClick={() => setStep("05f")}
              className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#1B4F8B] transition-colors"
            >
              Continue to 05f
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ---- 05f Commit ---- */}
      {step === "05f" && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">05f · Commit verified AWB summary</h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Classification is set here, not later — the FC-02 amendment requires class and subclass
            at indexation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Cargo class · CARGOCLASSID
              </span>
              <select
                value={classId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setClassId(id);
                  setSubClassId(subClassesOf(id)[0]?.SUBCLASSID ?? subClassId);
                }}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer"
              >
                {CARGO_CLASSES.map((c) => (
                  <option key={c.ID} value={c.ID}>
                    {c.ABBREVATION} — {c.NAME}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Cargo subclass · CARGOSUBCLASS
              </span>
              <select
                value={subClassId}
                onChange={(e) => setSubClassId(Number(e.target.value))}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer"
              >
                {subClassesOf(classId).map((s) => (
                  <option key={s.SUBCLASSID} value={s.SUBCLASSID}>
                    {s.ABBREVATION} — {s.NAME}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Summary to commit
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Lines", String(lines.length)],
                ["Pieces (received)", String(totals.pieces.physical)],
                ["Weight (received)", formatKg(totals.weightKg.physical)],
                ["Classification", cargoSubClass(subClassId).ABBREVATION],
                ["IGM linkage", awb.IGMNO],
                ["Variance", overTolerance ? "Over tolerance" : "Within tolerance"],
              ].map(([l, v]) => (
                <div key={l} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    {l}
                  </span>
                  <span className="text-[13px] font-semibold text-[#0F172A]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {committed ? (
            <div className="mt-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
              <p className="text-[14px] font-semibold text-[#16A34A]">
                Committed — AWB summary verified
              </p>
              <p className="text-[12px] text-[#15803D] mt-1">
                Hands to FC-01 step 06 (AWB summary preparation) and on to indexing.
                {overTolerance ? " A CDR was raised from the intake variance." : ""}
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Link
                  href="/import/indexing"
                  className="h-9 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold no-underline inline-flex items-center"
                >
                  Continue to indexing
                </Link>
                <Link
                  href={`/awb/${awb.AWBId}?tab=intake`}
                  className="h-9 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] no-underline inline-flex items-center"
                >
                  View on AWB hub
                </Link>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCommitted(true)}
              className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#16A34A] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#15803D] transition-colors"
            >
              <Check size={15} />
              Commit verified summary
            </button>
          )}
        </div>
      )}
    </div>
  );
}
