"use client";

/**
 * P2-2 · Storage Allocation Engine — FC-03 amendment nodes 153:3476 → 153:3488.
 *
 *   Class / subclass set at intake (OCR-captured, operator-confirmed)
 *     → System suggests rack / bin by class + subclass + capacity
 *       (CARGOSUBCLASSLOCATION rules)
 *     → Location valid & available?
 *         yes → Bind RFID / barcode tag → location; putaway confirmed by scan
 *         no  → Suggest alternate zone / overflow  ↺
 *
 * The existing putaway screen has a SuggestedLocation component whose
 * suggestion is a hard-coded string. Here the suggestion is derived from
 * the P2-1 rules and live capacity, and it explains itself.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  ShieldAlert,
  Thermometer,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  allocationCandidates,
  cargoClass,
  cargoSubClass,
  formatKg,
  listAwbs,
  type SiteCode,
} from "@/lib/domain";

export default function AllocationEnginePage() {
  const { scope, isHq } = useSite();
  const siteCode = (isHq ? "KHI" : scope) as SiteCode;

  // The allocation queue: accepted, not yet stored.
  const queue = useMemo(
    () =>
      listAwbs({ scope }).filter((a) =>
        ["tagging", "segregation", "acceptance"].includes(a.stage),
      ),
    [scope],
  );
  const all = useMemo(() => listAwbs({ scope }), [scope]);
  const candidates = queue.length > 0 ? queue : all.slice(0, 8);

  const [awbId, setAwbId] = useState<number>(candidates[0]?.AWBId ?? 0);
  const awb = candidates.find((a) => a.AWBId === awbId) ?? candidates[0];

  const [chosen, setChosen] = useState<number | null>(null);
  const [override, setOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  const options = useMemo(
    () => (awb ? allocationCandidates(awb.cargoSubClassId, siteCode, awb.TOTALCHRGWEIGHT) : []),
    [awb, siteCode],
  );

  if (!awb) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={[{ label: "Storage" }, { label: "Allocation" }]} />
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#0F172A]">Nothing awaiting allocation</p>
        </div>
      </div>
    );
  }

  const cls = cargoClass(awb.CARGOCLASSID);
  const sub = cargoSubClass(awb.cargoSubClassId);
  const preferred = options.find((o) => o.preference === "preferred");
  const suggestion = options.find((o) => o.fits) ?? null;
  const preferredBlocked = !!preferred && !preferred.fits;
  const noValidLocation = options.length === 0;
  const selected = chosen ? options.find((o) => o.location.ID === chosen) : suggestion;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Storage" }, { label: "Allocation Engine" }]} />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
                M05
              </span>
              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
                FC-03 amendment
              </span>
            </div>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
              Storage Allocation Engine
            </h1>
            <p className="text-[13px] text-[#64748B] mt-1">
              System-driven, not manual entry. The suggestion comes from the CARGOSUBCLASSLOCATION
              rules and live capacity — and says why.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Allocation queue ({candidates.length})
            </span>
            <select
              value={awbId}
              onChange={(e) => {
                setAwbId(Number(e.target.value));
                setChosen(null);
                setOverride(false);
                setOverrideReason("");
              }}
              className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer font-mono"
            >
              {candidates.map((a) => (
                <option key={a.AWBId} value={a.AWBId}>
                  {a.AWBNO} — {cargoClass(a.CARGOCLASSID).ABBREVATION}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 1 — classification from intake */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-[11px] font-bold flex items-center justify-center">
            1
          </span>
          <h3 className="text-[14px] font-semibold text-[#0F172A]">
            Class / subclass set at intake
          </h3>
          <span className="h-[20px] px-2 rounded bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold inline-flex items-center">
            OCR-captured, operator-confirmed
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-3">
          {[
            ["AWB", <AwbLink key="a" awbNo={awb.AWBNO} awbId={awb.AWBId} />],
            ["Class", `${cls.ABBREVATION} — ${cls.NAME}`],
            ["Subclass", `${sub.ABBREVATION} — ${sub.NAME}`],
            ["Chargeable weight", formatKg(awb.TOTALCHRGWEIGHT)],
            ["Pieces", String(awb.TOTALPCS)],
          ].map(([l, v], i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                {l as string}
              </span>
              <span className="text-[13px] font-semibold text-[#0F172A]">{v}</span>
            </div>
          ))}
        </div>
        {(sub.tempBandC || sub.Authority) && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F1F5F9] flex-wrap">
            {sub.tempBandC && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#DBEAFE] text-[#1B4F8B] text-[12px] font-semibold">
                <Thermometer size={13} />
                {sub.tempBandC[0]}°C to {sub.tempBandC[1]}°C
              </span>
            )}
            {sub.Authority && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#FEF3C7] text-[#D97706] text-[12px] font-semibold">
                <ShieldAlert size={13} />
                {sub.Authority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Step 2 — suggestion */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              System suggests rack / bin
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              by class + subclass + capacity — CARGOSUBCLASSLOCATION rules at {siteCode}
            </p>
          </div>
          <Cpu size={16} className="text-[#7C3AED] ml-auto" />
        </div>

        {noValidLocation ? (
          <div className="p-5">
            <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#DC2626]">
                  No permitted location for {sub.ABBREVATION} at {siteCode}
                </p>
                <p className="text-[12px] text-[#991B1B] mt-0.5">
                  This is a rules configuration error, not a capacity problem. Fix it in the master
                  before this cargo can be allocated.
                </p>
                <Link
                  href="/storage/master"
                  className="inline-flex items-center gap-1 h-8 px-3 mt-3 rounded-lg bg-[#DC2626] text-white text-[12px] font-semibold no-underline"
                >
                  Open rules editor <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-3">
            {options.map((o) => {
              const isChosen = (chosen ?? suggestion?.location.ID) === o.location.ID;
              const tone = !o.fits
                ? { border: "#FECACA", bg: "#FEF2F2", fg: "#DC2626" }
                : o.preference === "preferred"
                  ? { border: "#BBF7D0", bg: "#F0FDF4", fg: "#16A34A" }
                  : { border: "#FDE68A", bg: "#FFFBEB", fg: "#D97706" };
              return (
                <button
                  key={o.location.ID}
                  onClick={() => o.fits && setChosen(o.location.ID)}
                  disabled={!o.fits}
                  className="w-full text-left rounded-xl border p-4 transition-colors"
                  style={{
                    borderColor: isChosen ? "#0B2545" : tone.border,
                    backgroundColor: isChosen ? "#EBF0F7" : tone.bg,
                    borderWidth: isChosen ? 2 : 1,
                    cursor: o.fits ? "pointer" : "not-allowed",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#0F172A]">
                          {o.location.NAME}
                        </span>
                        <span className="font-mono text-[11px] text-[#64748B]">
                          {o.location.ABBREVATION}
                        </span>
                        <span
                          className="h-[20px] px-2 rounded text-[10px] font-bold inline-flex items-center"
                          style={{ backgroundColor: "white", color: tone.fg }}
                        >
                          {o.preference}
                        </span>
                        {isChosen && (
                          <span className="h-[20px] px-2 rounded bg-[#0B2545] text-white text-[10px] font-bold inline-flex items-center">
                            selected
                          </span>
                        )}
                      </div>
                      {/* The engine explains itself — this is the point of the amendment */}
                      <p className="text-[12px] text-[#64748B] mt-1">{o.reason}</p>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">
                          Available
                        </p>
                        <p
                          className="text-[13px] font-semibold font-mono"
                          style={{ color: o.fits ? "#0F172A" : "#DC2626" }}
                        >
                          {formatKg(o.availableKg)}
                        </p>
                      </div>
                      <div className="text-right w-24">
                        <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">
                          Utilisation
                        </p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <div className="w-12 h-1.5 rounded-full bg-white overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${o.utilisationPct}%`,
                                backgroundColor: o.utilisationPct >= 85 ? "#DC2626" : "#16A34A",
                              }}
                            />
                          </div>
                          <span className="text-[12px] font-mono font-semibold">
                            {o.utilisationPct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!o.fits && (
                    <p className="text-[12px] font-semibold text-[#DC2626] mt-2">
                      Refused — needs {formatKg(awb.TOTALCHRGWEIGHT)}, only{" "}
                      {formatKg(o.availableKg)} free
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {preferredBlocked && suggestion && (
          <div className="px-5 pb-5">
            <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <p className="text-[13px] font-semibold text-[#D97706]">
                Preferred zone full — overflow suggested
              </p>
              <p className="text-[12px] text-[#92400E] mt-1">
                {preferred!.location.NAME} cannot take {formatKg(awb.TOTALCHRGWEIGHT)}.{" "}
                {suggestion.location.NAME} is permitted for {sub.ABBREVATION} but sits outside the
                preferred zone — the compromise is stated rather than hidden.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 3 — validation gate */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
            3
          </span>
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Location valid &amp; available?</h3>
        </div>

        <div className="flex flex-col gap-2">
          {[
            {
              label: `Permitted for subclass ${sub.ABBREVATION}`,
              pass: !!selected,
              detail: selected ? selected.reason : "No permitted location",
            },
            {
              label: "Capacity available",
              pass: !!selected?.fits,
              detail: selected
                ? `${formatKg(selected.availableKg)} free, needs ${formatKg(awb.TOTALCHRGWEIGHT)}`
                : "—",
            },
            {
              label: "Temperature band satisfied",
              pass: !sub.tempBandC || !!selected?.location.tempBandC,
              detail: sub.tempBandC
                ? selected?.location.tempBandC
                  ? `Zone holds ${selected.location.tempBandC[0]} to ${selected.location.tempBandC[1]}°C`
                  : "Zone is not temperature-controlled"
                : "Not applicable",
            },
            {
              label: "Access authority present",
              pass: !sub.Authority || !!selected?.location.Authority,
              detail: sub.Authority
                ? (selected?.location.Authority ?? "Zone has no access control")
                : "Not applicable",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{
                borderColor: c.pass ? "#BBF7D0" : "#FECACA",
                backgroundColor: c.pass ? "#F0FDF4" : "#FEF2F2",
              }}
            >
              {c.pass ? (
                <Check size={15} className="text-[#16A34A] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              ) : (
                <AlertTriangle size={15} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-[13px] font-semibold text-[#0F172A]">{c.label}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Override — reason mandatory, lands in the audit strip */}
        <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-[13px] font-medium text-[#0F172A]">
              Override the engine and choose manually
            </span>
          </label>
          {override && (
            <div className="mt-3">
              <input
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for override — required, recorded in the audit trail"
                className="w-full h-10 px-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] text-[13px] outline-none focus:border-[#D97706]"
              />
              {!overrideReason && (
                <p className="text-[11px] text-[#D97706] mt-1.5">
                  An override without a reason is not recorded — the field is mandatory.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step 4 — hand to tag binding */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              Bind RFID / barcode tag → location
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Putaway is confirmed by scan. The tag bound here is the identity FC-08 reads at
              retrieval and gate-out.
            </p>
          </div>
        </div>
        <Link
          href={`/storage/rfid-binding?awb=${awb.AWBId}`}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold no-underline transition-colors"
          style={{
            backgroundColor: selected?.fits && (!override || overrideReason) ? "#0B2545" : "#F1F5F9",
            color: selected?.fits && (!override || overrideReason) ? "white" : "#94A3B8",
            pointerEvents: selected?.fits && (!override || overrideReason) ? "auto" : "none",
          }}
        >
          Continue to tag binding
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
