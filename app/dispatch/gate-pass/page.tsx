"use client";

/**
 * P6-1 / P6-2 · Gate Pass + picking with RFID piece-count verification.
 *
 * `GATEPASS` is 43 columns in CMTS and the demo rendered almost none of
 * them — vehicle, driver, transporter, escort and the seal fields had no
 * home at all.
 *
 * The FC-08 amendment is what makes the pick list interesting: the tag
 * bound at putaway (FC-03) is **read again at retrieval**, so the piece
 * count verifies itself rather than being typed. That turns "Piece Count
 * Matched?" from a question an operator answers into one the scan answers —
 * and when it comes back short, FC-08 routes it to a CDR rather than
 * letting the shortfall leave the building.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PackageCheck, Radio, Truck, XCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AuditStrip, DocNumber } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  awbByNo,
  formatDate,
  formatDateTime,
  listGatePasses,
  pickSessionFor,
  storageLocation,
} from "@/lib/domain";

const OUTCOME_TONE: Record<string, { bg: string; fg: string }> = {
  retrieved: { bg: "#DCFCE7", fg: "#16A34A" },
  pending: { bg: "#F1F5F9", fg: "#64748B" },
  unavailable: { bg: "#FEE2E2", fg: "#DC2626" },
  short: { bg: "#FEE2E2", fg: "#DC2626" },
  damaged: { bg: "#FEF3C7", fg: "#D97706" },
};

export default function GatePassPage() {
  const { scope, isHq } = useSite();
  const passes = useMemo(() => listGatePasses(scope), [scope]);

  const [selected, setSelected] = useState<number | null>(passes[0]?.GATEPASSNO ?? null);
  const gp = passes.find((p) => p.GATEPASSNO === selected) ?? passes[0] ?? null;
  const session = gp ? pickSessionFor(gp.GATEPASSNO) : null;
  const awb = gp ? awbByNo(gp.AWBNO) : null;

  const [tab, setTab] = useState<"pass" | "pick">("pass");

  const shortSessions = passes.filter((p) => {
    const s = pickSessionFor(p.GATEPASSNO);
    return s && !s.countMatched;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Dispatch" }, { label: "Gate Pass & Picking" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M13
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              GATEPASS 43 cols · FC-08 §04–09
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Gate Pass &amp; Picking
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            The vehicle and driver record, and a pick list the RFID scan verifies for you.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gate passes", value: String(passes.length), tone: "#0F172A" },
          { label: "Short picks", value: String(shortSessions.length), tone: "#DC2626" },
          {
            label: "Pieces scanned",
            value: String(
              passes.reduce((n, p) => n + (pickSessionFor(p.GATEPASSNO)?.scannedPieces ?? 0), 0),
            ),
            tone: "#16A34A",
          },
          {
            label: "Sessions open",
            value: String(
              passes.filter((p) => !pickSessionFor(p.GATEPASSNO)?.completedAt).length,
            ),
            tone: "#D97706",
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

      {passes.length === 0 ? (
        <EmptyState
          title="No gate passes at this site"
          description="A gate pass issues once the DO is verified against CNIC and authority letter — FC-08 §02–04."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Truck size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Gate passes</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {passes.map((p) => {
                const s = pickSessionFor(p.GATEPASSNO);
                return (
                  <button
                    key={p.GATEPASSNO}
                    onClick={() => setSelected(p.GATEPASSNO)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: gp?.GATEPASSNO === p.GATEPASSNO ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                        GP-{p.GATEPASSNO}
                      </span>
                      {s && (
                        <span
                          className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center"
                          style={
                            s.countMatched
                              ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                              : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                          }
                        >
                          {s.scannedPieces}/{s.expectedPieces}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{p.AWBNO}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {p.VehicleNo} · {formatDate(p.GATEPASSDATE)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {gp && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DocNumber doc={gp.docNumber} />
                      {awb && <AwbLink awbNo={awb.AWBNO} awbId={awb.AWBId} />}
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1.5">
                      Issued {formatDate(gp.GATEPASSDATE)} · {gp.PIECES} pcs · {gp.CONSIGNEE}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    ["pass", "Gate pass record (43 cols)"],
                    ["pick", `Pick session${session ? ` (${session.scannedPieces}/${session.expectedPieces})` : ""}`],
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

              {tab === "pass" && (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      Gate pass record
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      CMTS GATEPASS — the columns the demo never rendered
                    </p>
                  </div>
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                    {(
                      [
                        ["GATEPASSNO", String(gp.GATEPASSNO)],
                        ["GATEPASSDATE", formatDate(gp.GATEPASSDATE)],
                        ["IGMNO", gp.IGMNO],
                        ["AWBNO", gp.AWBNO],
                        ["ARRIVALDATE", formatDate(gp.ARRIVALDATE)],
                        ["HWBNO", gp.HWBNO],
                        ["DONo", gp.DONo],
                        ["GRNo", gp.GRNo],
                        ["ChallanNo", gp.ChallanNo],
                        ["CASHNO", gp.CASHNO],
                        ["INDEXNO", gp.INDEXNO],
                        ["PIECES", String(gp.PIECES)],
                        ["WEIGHT", String(gp.WEIGHT)],
                        ["CONSIGNEE", gp.CONSIGNEE],
                        ["Agent", gp.Agent],
                        ["RecivingPerson", gp.RecivingPerson],
                        ["NICNO", gp.NICNO],
                        ["CPNO", gp.CPNO],
                        ["RcvngPersonPic", gp.RcvngPersonPic],
                        ["VehicleNo", gp.VehicleNo],
                        ["ClearingTime", gp.ClearingTime],
                        ["MarksNumber", gp.MarksNumber],
                        ["DeliveryDate", gp.DeliveryDate ? formatDate(gp.DeliveryDate) : null],
                        ["NAMEOFCUSTODIANSHED", gp.NAMEOFCUSTODIANSHED],
                        ["SerialNoWithYear", gp.SerialNoWithYear],
                        ["DetendIdentification", gp.DetendIdentification],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                        <span
                          className="text-[13px] font-medium break-words"
                          style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                        >
                          {v ?? "null"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <AuditStrip record={gp} />
                </div>
              )}

              {tab === "pick" && session && (
                <>
                  <div
                    className="rounded-[16px] border px-5 py-4 flex items-start gap-3"
                    style={
                      session.countMatched
                        ? { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }
                        : { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }
                    }
                  >
                    {session.countMatched ? (
                      <PackageCheck size={17} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={17} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: session.countMatched ? "#16A34A" : "#DC2626" }}
                      >
                        {session.countMatched
                          ? `Piece count matched — ${session.scannedPieces} of ${session.expectedPieces} read`
                          : `Short pick — ${session.scannedPieces} of ${session.expectedPieces} read`}
                      </p>
                      <p
                        className="text-[12px] mt-0.5"
                        style={{ color: session.countMatched ? "#15803D" : "#991B1B" }}
                      >
                        {session.countMatched
                          ? "The count is verified by the tags bound at putaway, not typed by the operator."
                          : "FC-08 routes a short pick to a CDR rather than letting the shortfall leave the building."}
                      </p>
                      {session.cdrRef && (
                        <Link
                          href="/exceptions/cdr"
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#DC2626] no-underline hover:underline mt-2"
                        >
                          {session.cdrRef} <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                      <Radio size={15} className="text-[#64748B]" />
                      <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Pick list</h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Expected tag vs tag actually read at retrieval
                        </p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            {["Piece", "Location", "Expected tag", "Scanned tag", "Outcome", "Scanned"].map((h) => (
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
                          {session.lines.map((l) => {
                            const tone = OUTCOME_TONE[l.outcome];
                            const mismatch = l.expectedRfid !== l.scannedRfid;
                            return (
                              <tr
                                key={l.id}
                                className="border-b border-[#F1F5F9] last:border-0"
                                style={{ backgroundColor: mismatch ? "#FEF2F2" : undefined }}
                              >
                                <td className="px-4 py-2.5 font-mono text-[11px] text-[#0F172A]">
                                  {l.pieceId}
                                </td>
                                <td className="px-4 py-2.5 text-[12px] text-[#475569] whitespace-nowrap">
                                  {storageLocation(l.locationId)?.ABBREVATION ?? "—"}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#64748B]">
                                  {l.expectedRfid ?? "—"}
                                </td>
                                <td
                                  className="px-4 py-2.5 font-mono text-[10px]"
                                  style={{ color: l.scannedRfid ? "#64748B" : "#DC2626" }}
                                >
                                  {l.scannedRfid ?? "not read"}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span
                                    className="h-[20px] px-2 rounded-full text-[10px] font-bold inline-flex items-center uppercase"
                                    style={{ backgroundColor: tone.bg, color: tone.fg }}
                                  >
                                    {l.outcome}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-[11px] text-[#94A3B8] whitespace-nowrap">
                                  {l.scannedAt ? formatDateTime(l.scannedAt) : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {session.lines.some((l) => l.note) && (
                      <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                        {session.lines
                          .filter((l) => l.note)
                          .map((l) => (
                            <p key={l.id} className="text-[11px] text-[#991B1B]">
                              <span className="font-mono">{l.pieceId}</span> — {l.note}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/dispatch/gate-out"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Gate-out verification &amp; POD <ArrowUpRight size={12} />
                </Link>
                <Link
                  href="/billing/delivery-order"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                >
                  Delivery order <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
