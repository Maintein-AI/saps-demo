"use client";

/**
 * P4-4 · Detained cargo (Detend) register — CMTS `AwbDetendDetail` (7).
 *
 * Gap G1, and the subtlest thing in the whole CMTS schema.
 *
 * When customs detains **part** of an AWB, that part becomes its own
 * identity. `DetendUniqueIdentification` then appears on **12 other tables**
 * — DO, gate pass, godown rent, delivery, location — because from that
 * moment the detained portion is charged, stored, released and delivered
 * separately from the rest of the consignment.
 *
 * The demo has never modelled this. Without it, a partially-detained AWB
 * looks like one consignment with one location, one charge basis and one
 * gate pass — which is wrong on every count, and wrong in the direction
 * that over-releases cargo.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Lock, MapPin, ShieldAlert, Split } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AgingBadge } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  DEMO_NOW,
  awbById,
  cargoClass,
  clearanceFor,
  daysBetween,
  formatDate,
  formatKg,
  listDetends,
  storageLocation,
} from "@/lib/domain";

/**
 * The 12 CMTS tables that carry `DetendUniqueIdentification` /
 * `DetendIdentification`. Naming them is the point — this is what makes the
 * sub-identity real rather than a flag.
 */
const CARRYING_TABLES = [
  { table: "IMPORTAWB", meaning: "Parent AWB flags IsDetend" },
  { table: "IMPORTAWBDETAIL", meaning: "Which detail lines are detained" },
  { table: "AWBLOCATION", meaning: "Detained portion stored separately" },
  { table: "AWBDELEIVERYORDER", meaning: "Its own delivery order" },
  { table: "GATEPASS", meaning: "Its own gate pass" },
  { table: "GODOWNRENT", meaning: "Charged on its own basis" },
  { table: "GODOWNRENTDETAIL", meaning: "Per-line rent for the detained part" },
  { table: "AWBCONSOLE", meaning: "House AWBs inherit the detention" },
  { table: "DELIVERYINFO", meaning: "Delivered separately" },
  { table: "PHYSICALDELIVERY", meaning: "Physical hand-over tracked apart" },
  { table: "AWBSECTION82", meaning: "Own statutory clock if it long-stays" },
  { table: "AwbDetendDetail", meaning: "The identity record itself" },
];

export default function DetainedCargoPage() {
  const { scope, isHq } = useSite();
  const detends = useMemo(() => listDetends(scope), [scope]);

  const [selectedId, setSelectedId] = useState<number | null>(detends[0]?.DetendId ?? null);
  const d = detends.find((x) => x.DetendId === selectedId) ?? detends[0] ?? null;

  const awb = d ? awbById(d.AwbId) : null;
  const clearance = d ? clearanceFor(d.AwbId) : null;

  const live = detends.filter((x) => !x.releasedAt);
  const totalKg = detends.reduce((n, x) => n + x.TotalWeight, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Customs" }, { label: "Detained Cargo" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M09
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              AwbDetendDetail (7) · 12 carrying tables
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center font-mono">
              GAP G1
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Detained Cargo Register
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            A detained portion of an AWB becomes its own identity — stored, charged, released and
            delivered separately from the rest.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Detend records", value: String(detends.length), tone: "#0F172A" },
          { label: "Still detained", value: String(live.length), tone: "#DC2626" },
          { label: "Detained weight", value: formatKg(totalKg), tone: "#D97706" },
          {
            label: "Longest detention",
            value: live.length
              ? `${Math.max(...live.map((x) => daysBetween(x.detainedAt, DEMO_NOW)))}d`
              : "—",
            tone: "#7C3AED",
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

      {detends.length === 0 ? (
        <EmptyState
          title="No detained cargo at this site"
          description="A detention is raised when a red-channel examination finds a discrepancy, or customs holds part of a consignment for adjudication."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <Lock size={15} className="text-[#64748B]" />
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Register</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {detends.map((x) => {
                const parent = awbById(x.AwbId);
                return (
                  <button
                    key={x.DetendId}
                    onClick={() => setSelectedId(x.DetendId)}
                    className="w-full text-left px-5 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ backgroundColor: d?.DetendId === x.DetendId ? "#EBF0F7" : undefined }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#0F172A] truncate">
                        {x.UniqueIdentification}
                      </span>
                      <span
                        className="h-[18px] px-1.5 rounded text-[9px] font-bold inline-flex items-center flex-shrink-0"
                        style={
                          x.releasedAt
                            ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                            : { backgroundColor: "#FEE2E2", color: "#DC2626" }
                        }
                      >
                        {x.releasedAt ? "RELEASED" : "DETAINED"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {parent?.AWBNO} · {x.TotalPieces} pcs · {formatKg(x.TotalWeight)}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                      {formatDate(x.detainedAt)} · {x.reason}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {d && awb && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Parent vs detained split — the whole point */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                  <Split size={15} className="text-[#64748B]" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      The split — one AWB, two identities
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      From detention onward these are charged and released separately
                    </p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Parent AWB
                    </p>
                    <div className="mt-1.5">
                      <AwbLink awbNo={awb.AWBNO} awbId={awb.AWBId} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                      {[
                        ["Pieces", String(awb.TOTALPCS)],
                        ["Weight", formatKg(awb.TOTALWEIGHT)],
                        ["Class", cargoClass(awb.CARGOCLASSID).ABBREVATION],
                        [
                          "Location",
                          awb.locationId ? storageLocation(awb.locationId)?.ABBREVATION ?? "—" : "—",
                        ],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{l}</p>
                          <p className="text-[13px] font-medium text-[#0F172A]">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3.5">
                    <p className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                      Detained sub-identity
                    </p>
                    <p className="font-mono text-[12px] font-semibold text-[#7F1D1D] mt-1.5 break-all">
                      {d.UniqueIdentification}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                      {[
                        ["Pieces", String(d.TotalPieces)],
                        ["Weight", formatKg(d.TotalWeight)],
                        ["Charge wt", formatKg(d.TotalChargeWeight)],
                        ["Location", storageLocation(d.locationId)?.ABBREVATION ?? "—"],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[10px] text-[#B91C1C] uppercase tracking-wider">{l}</p>
                          <p className="text-[13px] font-medium text-[#7F1D1D]">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Proportion bar */}
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
                    <span>
                      Detained {d.TotalPieces} of {awb.TOTALPCS} pieces
                    </span>
                    <span>
                      {((d.TotalPieces / Math.max(1, awb.TOTALPCS)) * 100).toFixed(0)}% of the
                      consignment
                    </span>
                  </div>
                  <div className="h-[10px] rounded-full bg-[#DCFCE7] overflow-hidden">
                    <div
                      className="h-full bg-[#DC2626]"
                      style={{ width: `${(d.TotalPieces / Math.max(1, awb.TOTALPCS)) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1.5">
                    The green remainder can proceed to release on its own once the AWB clears; the
                    red portion cannot, and carries its own charge clock while it waits.
                  </p>
                </div>
              </div>

              {/* Detend record — all 7 CMTS columns */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">Detend record</h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      CMTS AwbDetendDetail — all 7 columns, plus AirVault provenance
                    </p>
                  </div>
                  <AgingBadge
                    totalDays={daysBetween(d.detainedAt, d.releasedAt ?? DEMO_NOW)}
                    freeDays={cargoClass(awb.CARGOCLASSID).freeDays}
                  />
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                  {(
                    [
                      ["DetendId", String(d.DetendId)],
                      ["AwbId", String(d.AwbId)],
                      ["UniqueIdentification", d.UniqueIdentification],
                      ["TotalPieces", String(d.TotalPieces)],
                      ["TotalWeight", formatKg(d.TotalWeight)],
                      ["TotalChargeWeight", formatKg(d.TotalChargeWeight)],
                      ["GOODS", d.GOODS],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-[#CBD5E1]">{k}</span>
                      <span className="text-[13px] font-medium text-[#0F172A] break-words">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5 pt-1 border-t border-[#F1F5F9] grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                  {(
                    [
                      ["detainedAt", formatDate(d.detainedAt)],
                      ["detainedBy", d.detainedBy],
                      ["reason", d.reason],
                      ["releasedAt", d.releasedAt ? formatDate(d.releasedAt) : null],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1 pt-4">
                      <span className="text-[9px] font-mono text-[#CBD5E1]">
                        {k} <span className="text-[#7C3AED]">·AV</span>
                      </span>
                      <span
                        className="text-[13px] font-medium break-words"
                        style={{ color: v ? "#0F172A" : "#CBD5E1" }}
                      >
                        {v ?? "null — still detained"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where the identity travels */}
              <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
                  <GitBranch size={15} className="text-[#64748B]" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                      Where this identity travels
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      12 CMTS tables carry DetendUniqueIdentification / DetendIdentification
                    </p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2.5">
                  {CARRYING_TABLES.map((t) => (
                    <div key={t.table} className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#1B4F8B] flex-shrink-0">
                        {t.table}
                      </span>
                      <span className="text-[11px] text-[#64748B]">{t.meaning}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B]">
                    Phases 5–6 must honour this: the charge engine, delivery order and gate pass all
                    key on the sub-identity, not the parent AWB. Ignoring it releases detained cargo
                    on the parent&apos;s paperwork.
                  </p>
                </div>
              </div>

              {/* Link back to the examination that caused it */}
              {clearance?.examination?.discrepancyFound && (
                <div className="rounded-[16px] border border-[#FCA5A5] bg-[#FEF2F2] px-5 py-4 flex items-start gap-3">
                  <ShieldAlert size={17} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#DC2626]">
                      Raised by a red-channel examination
                    </p>
                    <p className="text-[12px] text-[#991B1B] mt-0.5">
                      {clearance.examination.findings}
                    </p>
                    <Link
                      href="/customs/channels"
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#DC2626] no-underline hover:underline mt-2"
                    >
                      Examination record <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              )}

              <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={15} className="text-[#64748B]" />
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">Storage</h3>
                </div>
                <p className="text-[13px] text-[#0F172A]">
                  {storageLocation(d.locationId)?.NAME ?? "—"}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Detained cargo is segregated from the parent consignment — the location on this
                  record is authoritative for the detained pieces, not the AWB&apos;s.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
