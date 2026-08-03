"use client";

/**
 * P1-6 · M04 Cargo Receipt & Acceptance.
 *
 * FC-01 §13 Acceptance Check → §14 Weighing / Dimensioning / Condition Check.
 * FC-02 terminal lane: counted & weighed → inspected → sorted.
 *
 * `IMPORTAWBDETAIL` (32 cols) carries a short-landing and damage vocabulary
 * the demo did not have — `Shortland` returned **0 hits** before this screen.
 * All 32 columns are represented.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Camera, Scale } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  DAMAGE_TYPES,
  PACK_TYPES,
  VARIANCE_TOLERANCE,
  VOLUMETRIC_DIVISOR,
  chargeableKg,
  detailsFor,
  formatKg,
  listAwbs,
  round2,
  variance,
  volumetricKg,
} from "@/lib/domain";

export default function AcceptancePage() {
  const { scope } = useSite();
  const candidates = useMemo(
    () =>
      listAwbs({ scope }).filter((a) =>
        ["indexation", "tagging", "segregation", "acceptance", "stored"].includes(a.stage),
      ),
    [scope],
  );
  const [awbId, setAwbId] = useState<number>(candidates[0]?.AWBId ?? 0);
  const awb = candidates.find((a) => a.AWBId === awbId) ?? candidates[0];
  const details = awb ? detailsFor(awb.AWBId) : [];

  // Live weighing panel — the FC-07 §05/§06 formulas, computed here at acceptance.
  const [dims, setDims] = useState({ l: 120, w: 80, h: 90 });
  const [actual, setActual] = useState(awb?.TOTALWEIGHT ?? 0);
  const vol = volumetricKg({ lengthCm: dims.l, widthCm: dims.w, heightCm: dims.h, unit: "cm" });
  const chargeable = chargeableKg(actual, vol);

  if (!awb) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "Acceptance" }]} />
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#0F172A]">Nothing to accept at {scope}</p>
        </div>
      </div>
    );
  }

  const totalShort = details.reduce((n, d) => n + d.SHORTLANDED, 0);
  const totalDamaged = details.reduce((n, d) => n + d.DAMAGEPCS, 0);
  const totalDeclared = details.reduce((n, d) => n + d.PCS, 0);
  const totalReceived = details.reduce((n, d) => n + d.RECEIVEDPCS, 0);
  const v = variance(totalDeclared, totalReceived);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "Cargo Acceptance" }]} />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
                M04
              </span>
              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
                FC-01 §13–14
              </span>
            </div>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
              Cargo Receipt &amp; Acceptance
            </h1>
            <p className="text-[13px] text-[#64748B] mt-1">
              Piece-by-piece receipt including short-landed, damaged and part-received cargo.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Acceptance queue ({candidates.length})
            </span>
            <select
              value={awbId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setAwbId(id);
                const n = candidates.find((a) => a.AWBId === id);
                if (n) setActual(n.TOTALWEIGHT);
              }}
              className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer font-mono"
            >
              {candidates.map((a) => (
                <option key={a.AWBId} value={a.AWBId}>
                  {a.AWBNO} — {a.stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Declared pieces", value: totalDeclared, tone: "#0F172A" },
          { label: "Received pieces", value: totalReceived, tone: totalReceived === totalDeclared ? "#16A34A" : "#DC2626" },
          { label: "Short-landed", value: totalShort, tone: totalShort ? "#DC2626" : "#16A34A" },
          { label: "Damaged pieces", value: totalDamaged, tone: totalDamaged ? "#D97706" : "#16A34A" },
          { label: "Variance", value: `${(v.ratio * 100).toFixed(1)}%`, tone: v.overTolerance ? "#DC2626" : "#16A34A" },
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

      {v.overTolerance && (
        <div className="rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#DC2626]">
              Variance exceeds the {Math.round(VARIANCE_TOLERANCE * 100)}% tolerance
            </p>
            <p className="text-[12px] text-[#991B1B] mt-1">
              FC-04 amendment: this auto-raises a CDR — Shortage / Overage / Wrong Weight fall
              straight out of acceptance rather than waiting to be spotted.
            </p>
            <Link
              href={`/awb/${awb.AWBId}?tab=exceptions`}
              className="inline-flex items-center gap-1 h-9 px-3 mt-3 rounded-lg bg-[#DC2626] text-white text-[12px] font-semibold no-underline"
            >
              Open CDR <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* FC-01 §14 weighing & dimensioning */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Scale size={16} className="text-[#64748B]" />
          <h2 className="text-[16px] font-semibold text-[#0F172A]">
            §14 · Weighing &amp; dimensioning
          </h2>
        </div>
        <p className="text-[13px] text-[#64748B]">
          Chargeable weight is computed here, not at billing — FC-07 §05–06 uses these values.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-5">
          {(
            [
              ["Length (cm)", dims.l, (n: number) => setDims({ ...dims, l: n })],
              ["Width (cm)", dims.w, (n: number) => setDims({ ...dims, w: n })],
              ["Height (cm)", dims.h, (n: number) => setDims({ ...dims, h: n })],
              ["Actual weight (kg)", actual, (n: number) => setActual(n)],
            ] as const
          ).map(([label, val, set]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                {label}
              </span>
              <input
                type="number"
                value={val}
                onChange={(e) => set(Number(e.target.value))}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-mono outline-none focus:border-[#2E75B6]"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Volumetric
            </span>
            <div className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-mono font-semibold text-[#0F172A]">
              {vol}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">
              L×W×H / {VOLUMETRIC_DIVISOR}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Chargeable
            </span>
            <div
              className="h-10 px-3 rounded-lg border flex items-center text-[13px] font-mono font-bold"
              style={{
                borderColor: chargeable === vol ? "#FDE68A" : "#BBF7D0",
                backgroundColor: chargeable === vol ? "#FFFBEB" : "#F0FDF4",
                color: chargeable === vol ? "#D97706" : "#16A34A",
              }}
            >
              {chargeable}
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">max(actual, volumetric)</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Billed on
            </span>
            <div className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center text-[13px] font-semibold text-[#0F172A]">
              {chargeable === vol && vol > actual ? "Volume" : "Weight"}
            </div>
          </div>
        </div>
      </div>

      {/* IMPORTAWBDETAIL — all 32 columns across the line rows */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Acceptance worksheet</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            CMTS IMPORTAWBDETAIL — 32 columns, one row per detail line
          </p>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {details.map((d) => (
            <div key={d.DetailId} className="rounded-xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#64748B]">Line {d.SEQUENCE}</span>
                  <span className="text-[13px] font-semibold text-[#0F172A]">{d.GOODS}</span>
                </div>
                <div className="flex items-center gap-2">
                  {d.SHORTLANDED > 0 && (
                    <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#FEE2E2] text-[#DC2626]">
                      {d.SHORTLANDED} short-landed
                    </span>
                  )}
                  {d.DAMAGEPCS > 0 && (
                    <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#FEF3C7] text-[#D97706]">
                      {d.DAMAGEPCS} damaged
                    </span>
                  )}
                  {d.Shipment === "PART" && (
                    <span className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center bg-[#DBEAFE] text-[#1B4F8B]">
                      part shipment
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-4">
                {(
                  [
                    ["PCS", d.PCS, "declared"],
                    ["RECEIVEDPCS", d.RECEIVEDPCS, d.RECEIVEDPCS < d.PCS ? "short" : "ok"],
                    ["WEIGTH", round2(d.WEIGTH), "declared"],
                    ["RECEIVEDWT", round2(d.RECEIVEDWT), d.RECEIVEDWT < d.WEIGTH ? "short" : "ok"],
                    ["CHARGEWEIGTH", round2(d.CHARGEWEIGTH), "declared"],
                    ["CHARGEDRECEIVEDWT", round2(d.CHARGEDRECEIVEDWT), "ok"],
                    ["SHORTLANDED", d.SHORTLANDED, d.SHORTLANDED ? "short" : "ok"],
                    ["SHORTLANDEDREC", d.SHORTLANDEDREC, "ok"],
                    ["IsShortDetailed", d.IsShortDetailed ? "Yes" : "No", d.IsShortDetailed ? "short" : "ok"],
                    ["PartRemaining", d.PartRemaining, d.PartRemaining ? "short" : "ok"],
                    ["PartReceievd", d.PartReceievd, "ok"],
                    ["Shipment", d.Shipment, "ok"],
                    ["TYPEOFPACK", d.TYPEOFPACK, "ok"],
                    ["TYPEOFDAM", d.TYPEOFDAM, d.TYPEOFDAM ? "damage" : "ok"],
                    ["DAMAGEPCS", d.DAMAGEPCS, d.DAMAGEPCS ? "damage" : "ok"],
                    ["DAMAGEWEIGHT", round2(d.DAMAGEWEIGHT), d.DAMAGEWEIGHT ? "damage" : "ok"],
                    ["ClassId", d.ClassId, "ok"],
                    ["SplitClassId", d.SplitClassId, "ok"],
                    ["DetendUniqueIdentification", d.DetendUniqueIdentification, "ok"],
                    ["UniqueIdentification", d.UniqueIdentification, "ok"],
                    ["IsLock", d.IsLock ? "Yes" : "No", "ok"],
                    ["IsHold", d.IsHold ? "Yes" : "No", d.IsHold ? "damage" : "ok"],
                    ["Remarks", d.Remarks, "ok"],
                    ["DFLAG", d.DFLAG ? "Y" : "N", "ok"],
                  ] as const
                ).map(([k, val, tone]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-[#CBD5E1] truncate">{k}</span>
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{
                        color:
                          tone === "short" ? "#DC2626" : tone === "damage" ? "#D97706" : tone === "declared" ? "#64748B" : "#0F172A",
                      }}
                    >
                      {val === null || val === undefined || val === "" ? "—" : String(val)}
                    </span>
                  </div>
                ))}
              </div>

              {d.DEMAGEDETAIL && (
                <div className="px-4 pb-4">
                  <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5 flex items-start gap-2">
                    <Camera size={14} className="text-[#D97706] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#D97706]">Damage detail</p>
                      <p className="text-[12px] text-[#92400E] mt-0.5">{d.DEMAGEDETAIL}</p>
                      <p className="text-[11px] text-[#A16207] mt-1">
                        Photos attach to the AWB evidence pack (M02) and feed DamageDetail at P3-2.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reference lists — feed P10-3 master data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Pack types</h3>
          <div className="flex flex-wrap gap-2">
            {PACK_TYPES.map((p) => (
              <span
                key={p}
                className="h-7 px-2.5 rounded-full bg-[#F1F5F9] text-[#0F172A] text-[12px] font-medium inline-flex items-center"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Damage types</h3>
          <div className="flex flex-wrap gap-2">
            {DAMAGE_TYPES.map((p) => (
              <span
                key={p}
                className="h-7 px-2.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[12px] font-medium inline-flex items-center"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <AwbLink
          awbNo={awb.AWBNO}
          awbId={awb.AWBId}
          className="h-10 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold no-underline inline-flex items-center"
        >
          Open on AWB hub
        </AwbLink>
        <Link
          href="/warehouse-manager/putaway"
          className="h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] no-underline inline-flex items-center"
        >
          Continue to storage allocation
        </Link>
        <span className="text-[12px] text-[#94A3B8]">
          Total accepted: {formatKg(details.reduce((n, d) => n + d.RECEIVEDWT, 0))}
        </span>
      </div>
    </div>
  );
}
