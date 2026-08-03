"use client";

/**
 * ULD-level manifest reconciliation — from the real OD 0131 manifest.
 *
 * FC-01 §07 describes reconciliation as two-level: "Physical vs Manifest,
 * AWB, FFM/FWB/FHL". The actual cargo manifest is **three-level**, because
 * an AWB can arrive split across several ULDs on the same flight:
 *
 *   816-00052345   61/145 on PAG40387JT   +   84/145 on PAG40479JT
 *
 * Without the ULD tier, that AWB either double-counts or false-flags as a
 * discrepancy. This component is the proposed FC-01 §07 correction, built
 * against the real document so it can be checked line by line.
 */

import { AlertTriangle, Check, Container, Package } from "lucide-react";
import AwbLink from "@/components/awb/AwbLink";
import {
  REFERENCE_AWB_DOCUMENTS,
  REFERENCE_FLIGHT,
  REFERENCE_HAWB,
  REFERENCE_HAWB_DIVERGENCE,
  REFERENCE_MANIFEST_LINES,
  REFERENCE_ULDS,
  formatKg,
  rollupByAwb,
} from "@/lib/domain";

function Tier({
  n,
  title,
  subtitle,
  balanced,
  children,
}: {
  n: number;
  title: string;
  subtitle: string;
  balanced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {n}
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span
          className="h-[22px] px-2 rounded-full text-[10px] font-bold inline-flex items-center gap-1 flex-shrink-0"
          style={{
            backgroundColor: balanced ? "#DCFCE7" : "#FEE2E2",
            color: balanced ? "#16A34A" : "#DC2626",
          }}
        >
          {balanced ? <Check size={10} strokeWidth={3} /> : <AlertTriangle size={10} />}
          {balanced ? "Balanced" : "Divergence"}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function UldReconciliation() {
  const rollup = rollupByAwb(REFERENCE_MANIFEST_LINES);

  const uldPieces = REFERENCE_ULDS.reduce(
    (n, u) => n + REFERENCE_MANIFEST_LINES.filter((l) => l.uldId === u.uldId).reduce((m, l) => m + l.piecesOnUld, 0),
    0,
  );
  const uldNet = Math.round(REFERENCE_ULDS.reduce((n, u) => n + u.netWeightKg, 0) * 100) / 100;
  const flightBalanced =
    uldPieces === REFERENCE_FLIGHT.totals.pieces && uldNet === REFERENCE_FLIGHT.totals.netWeightKg;

  const awbBalanced = rollup.every((r) => r.complete);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] p-5">
        <div className="flex items-start gap-3">
          <Container size={18} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-[#7C3AED]">
              Proposed FC-01 §07 correction — reconciliation is three-level, not two
            </p>
            <p className="text-[12px] text-[#6D28D9] mt-1 leading-relaxed">
              Worked against the real manifest for {REFERENCE_FLIGHT.flightNo} /{" "}
              {REFERENCE_FLIGHT.flightDate} ({REFERENCE_FLIGHT.pointOfLoading} →{" "}
              {REFERENCE_FLIGHT.pointOfUnloading}, reg {REFERENCE_FLIGHT.registration}). AWB
              816-00052345 arrives split across two ULDs — 61/145 and 84/145 — which neither CMTS
              nor the current flow can express.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 1 — flight → ULD */}
      <Tier
        n={1}
        title="Flight → ULD"
        subtitle="Manifest grand total against the sum of ULD sub-totals. GWGT − net = ULD tare."
        balanced={flightBalanced}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-2.5">ULD-ID</th>
                <th className="text-left px-4 py-2.5">Disposition</th>
                <th className="text-right px-4 py-2.5">Pieces</th>
                <th className="text-right px-4 py-2.5">Net wt</th>
                <th className="text-right px-4 py-2.5">GWGT</th>
                <th className="text-right px-4 py-2.5">Tare</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_ULDS.map((u) => {
                const lines = REFERENCE_MANIFEST_LINES.filter((l) => l.uldId === u.uldId);
                const pcs = lines.reduce((n, l) => n + l.piecesOnUld, 0);
                return (
                  <tr key={u.uldId} className="border-b border-[#F1F5F9]">
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        {u.isBulk ? (
                          <Package size={13} className="text-[#94A3B8]" />
                        ) : (
                          <Container size={13} className="text-[#7C3AED]" />
                        )}
                        <span className="font-mono font-semibold">{u.uldId}</span>
                        {u.isBulk && (
                          <span className="h-[16px] px-1 rounded bg-[#F1F5F9] text-[#64748B] text-[9px] font-bold inline-flex items-center">
                            loose
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[#64748B]">{u.disposition}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{pcs}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{formatKg(u.netWeightKg)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#64748B]">
                      {formatKg(u.grossWeightKg)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#7C3AED]">
                      {u.tareWeightKg === 0 ? "—" : formatKg(u.tareWeightKg)}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-[#F8FAFC] font-semibold">
                <td className="px-4 py-2.5" colSpan={2}>
                  Manifest totals
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{uldPieces}</td>
                <td className="px-4 py-2.5 text-right font-mono">{formatKg(uldNet)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-[#64748B]" colSpan={2}>
                  document: {REFERENCE_FLIGHT.totals.pieces} / {formatKg(REFERENCE_FLIGHT.totals.netWeightKg)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Tier>

      {/* Tier 2 — ULD → AWB */}
      <Tier
        n={2}
        title="ULD → AWB"
        subtitle='The manifest "61/145" notation — pieces on this ULD over total pieces on the AWB. This is the sorting/indexing tier.'
        balanced={awbBalanced}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-2.5">AWB</th>
                <th className="text-left px-4 py-2.5">Carried on</th>
                <th className="text-left px-4 py-2.5">Route</th>
                <th className="text-left px-4 py-2.5">SCC</th>
                <th className="text-right px-4 py-2.5">Received</th>
                <th className="text-right px-4 py-2.5">Expected</th>
                <th className="text-right px-4 py-2.5">Net wt</th>
                <th className="text-left px-4 py-2.5">State</th>
              </tr>
            </thead>
            <tbody>
              {rollup.map((r) => {
                const first = REFERENCE_MANIFEST_LINES.find((l) => l.AWBNO === r.AWBNO)!;
                const split = r.ulds.length > 1;
                return (
                  <tr key={r.AWBNO} className="border-b border-[#F1F5F9]">
                    <td className="px-4 py-2.5">
                      <AwbLink awbNo={r.AWBNO} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {r.ulds.map((u, i) => {
                          const line = REFERENCE_MANIFEST_LINES.filter((l) => l.AWBNO === r.AWBNO)[i];
                          return (
                            <span
                              key={`${u}-${i}`}
                              className="h-[20px] px-1.5 rounded text-[10px] font-bold inline-flex items-center font-mono"
                              style={{
                                backgroundColor: split ? "#EDE9FE" : "#F1F5F9",
                                color: split ? "#7C3AED" : "#64748B",
                              }}
                            >
                              {u}
                              {line.piecesOnAwb !== null
                                ? ` ${line.piecesOnUld}/${line.piecesOnAwb}`
                                : ` ${line.piecesOnUld}`}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[12px]">
                      {first.origin} → {first.destination}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="h-[20px] px-2 rounded bg-[#DBEAFE] text-[#1B4F8B] text-[10px] font-bold inline-flex items-center font-mono">
                        {first.scc}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold">
                      {r.piecesReceived}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#64748B]">
                      {r.piecesExpected}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{formatKg(r.netWeightKg)}</td>
                    <td className="px-4 py-2.5">
                      {r.complete ? (
                        <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#DCFCE7] text-[#16A34A]">
                          {split ? "Complete across 2 ULDs" : "Complete"}
                        </span>
                      ) : (
                        <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#FEE2E2] text-[#DC2626]">
                          Short {r.shortPieces}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-[#F5F3FF] border-t border-[#DDD6FE]">
          <p className="text-[11px] text-[#6D28D9]">
            Note the split AWB: 61 + 84 = 145 pieces and 1,200.00 + 1,958.00 = 3,158.00 kg, matching
            the MAWB exactly. Treating each manifest line as an independent AWB would report this as
            two short shipments.
          </p>
        </div>
      </Tier>

      {/* Tier 3 — AWB → HAWB */}
      <Tier
        n={3}
        title="AWB → HAWB"
        subtitle="Consolidation breakdown. The reference HAWB's gross weight sits below its master's."
        balanced={false}
      >
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Master — {REFERENCE_HAWB.masterAwbNo}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Pieces</p>
                <p className="text-[14px] font-semibold font-mono">145</p>
              </div>
              <div>
                <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Gross</p>
                <p className="text-[14px] font-semibold font-mono">
                  {formatKg(REFERENCE_HAWB_DIVERGENCE.masterGrossKg)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
            <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">
              House — {REFERENCE_HAWB.hawbNo}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <p className="text-[10px] text-[#A16207] uppercase tracking-wider">Pieces</p>
                <p className="text-[14px] font-semibold font-mono">{REFERENCE_HAWB.pieces}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#A16207] uppercase tracking-wider">Gross</p>
                <p className="text-[14px] font-semibold font-mono text-[#D97706]">
                  {formatKg(REFERENCE_HAWB.grossWeightKg)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#A16207] uppercase tracking-wider">Net</p>
                <p className="text-[14px] font-semibold font-mono">
                  {formatKg(REFERENCE_HAWB.netWeightKg)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
            <p className="text-[13px] font-semibold text-[#D97706]">
              Master − house = {REFERENCE_HAWB_DIVERGENCE.deltaKg} kg
            </p>
            <p className="text-[12px] text-[#92400E] mt-1">{REFERENCE_HAWB_DIVERGENCE.note}</p>
            <p className="text-[11px] text-[#A16207] mt-2">
              CMTS has no master-vs-house weight reconciliation. Consolidation and split (P1-7)
              reconciles pieces and weight, but this divergence is a tolerance question for SAPS —
              at what delta does it become a CDR rather than a packing allowance?
            </p>
          </div>
        </div>
      </Tier>

      {/* Fields the manifest carries that CMTS does not */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">
            Manifest fields with no CMTS column
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Present on the ICAO Annex 9 cargo manifest, absent from IMPORTMANIFIEST / IMPORTAWB
          </p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["ULD-ID", "Groups AWB lines; BULK for loose", "Required for tier 1"],
            ["GWGT", "ULD gross weight — tare falls out of it", "Weight reconciliation"],
            ["Pieces X/Y", "Pieces on ULD over total on AWB", "The sorting/indexing tier"],
            ["SCC", "IATA special cargo code (GEN, PER, DGR…)", "Seeds FC-03 classification"],
            ["Org / Des per line", "AWB origin can precede the flight leg", "DEL→LHE on a KUL→LHE flight"],
            ["NEXT FLT", "Onward flight", "Identifies transhipment at intake (FC-09)"],
            ["Customs Status", "Per-line customs state", "Seeds FC-06"],
            ["CNT", "Contour / configuration", "Capacity planning"],
            ["MFT REMARKS", "Per-line manifest remarks", "Free text"],
          ].map(([field, what, why]) => (
            <div key={field} className="rounded-xl border border-[#E2E8F0] p-3">
              <p className="text-[12px] font-bold text-[#0F172A] font-mono">{field}</p>
              <p className="text-[12px] text-[#64748B] mt-1">{what}</p>
              <p className="text-[11px] text-[#1B4F8B] mt-1.5">{why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AWB documents behind the manifest */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">
            AWB documents on this flight
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            Transcribed from the scans — chargeable weight, divisor and charge totals all verified
            against the paperwork
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-2.5">AWB</th>
                <th className="text-left px-4 py-2.5">Agent (IATA code)</th>
                <th className="text-left px-4 py-2.5">Dim unit</th>
                <th className="text-right px-4 py-2.5">Gross</th>
                <th className="text-right px-4 py-2.5">Chargeable</th>
                <th className="text-left px-4 py-2.5">CHGS</th>
                <th className="text-right px-4 py-2.5">Weight charge</th>
                <th className="text-right px-4 py-2.5">Other (agent / carrier)</th>
                <th className="text-right px-4 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_AWB_DOCUMENTS.map((d) => (
                <tr key={d.AWBNO} className="border-b border-[#F1F5F9]">
                  <td className="px-4 py-2.5">
                    <AwbLink awbNo={d.AWBNO} />
                    <span className="block text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      {d.airlinePrefix}-{d.originCode}-{d.serialNo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px]">{d.issuingAgentName}</span>
                    {d.agentIataCode && (
                      <span className="block text-[10px] text-[#94A3B8] font-mono">
                        {d.agentIataCode}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center font-mono"
                      style={{
                        backgroundColor: d.dimensionUnit === "in" ? "#FEE2E2" : "#F1F5F9",
                        color: d.dimensionUnit === "in" ? "#DC2626" : "#64748B",
                      }}
                      title={
                        d.dimensionUnit === "in"
                          ? "Inches — volumetric divisor 366, not 6000"
                          : "Centimetres — divisor 6000"
                      }
                    >
                      {d.dimensionUnit} ÷ {d.dimensionUnit === "in" ? 366 : 6000}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">{d.grossWeightKg}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">
                    {d.chargeableWeightKg}
                    {d.chargeableWeightKg !== d.grossWeightKg && (
                      <span className="block text-[10px] text-[#D97706]">rounded up 0.5 kg</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-[12px] font-semibold">{d.chargeCode}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {d.weightCharge.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-[12px] text-[#64748B]">
                    {d.totalOtherChargesDueAgent.toLocaleString()} /{" "}
                    {d.totalOtherChargesDueCarrier.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">
                    {d.totalPrepaid.toLocaleString()} {d.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
