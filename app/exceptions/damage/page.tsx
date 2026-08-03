"use client";

/**
 * P3-2 · Damage detail register — CMTS `DamageDetail` (8 cols).
 *
 * CMTS records damage in two disconnected places: `IMPORTAWBDETAIL` carries
 * TYPEOFDAM / DEMAGEDETAIL / DAMAGEPCS / DAMAGEWEIGHT on the line, and
 * `DamageDetail` repeats it as its own row. Neither is browsable — there is
 * no damage register anywhere in the legacy UI, and no way to answer
 * "what got damaged this month, and by what cause".
 *
 * Two things this screen makes explicit that CMTS cannot:
 *   • damage that has *not* been escalated to a CDR. FC-04 §01 only opens a
 *     CDR when the discrepancy is material, so unescalated damage is a real
 *     state — and today it is invisible.
 *   • photos as first-class evidence, per the FC-04 §03 amendment.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Camera, PackageX, ShieldAlert } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { useSite } from "@/components/site/SiteContext";
import {
  DAMAGE_TYPES,
  PACK_TYPES,
  awbById,
  cargoClass,
  formatKg,
  listDamage,
} from "@/lib/domain";

type Filter = "all" | "escalated" | "unescalated";

export default function DamageRegisterPage() {
  const { scope, isHq } = useSite();
  const rows = useMemo(() => listDamage(scope), [scope]);

  const [filter, setFilter] = useState<Filter>("all");
  const [packFilter, setPackFilter] = useState<string>("all");

  const visible = rows.filter((d) => {
    if (filter === "escalated" && !d.cdrRef) return false;
    if (filter === "unescalated" && d.cdrRef) return false;
    if (packFilter !== "all" && d.TypeofPack !== packFilter) return false;
    return true;
  });

  const totalPcs = rows.reduce((n, d) => n + d.DamagedPcs, 0);
  const totalKg = rows.reduce((n, d) => n + d.DamageWeight, 0);
  const unescalated = rows.filter((d) => !d.cdrRef).length;

  /** Damage-type histogram — the question CMTS cannot answer. */
  const byType = DAMAGE_TYPES.map((t) => ({
    type: t,
    count: rows.filter((d) => d.TypeofDamage === t).length,
  })).filter((x) => x.count > 0);
  const maxType = Math.max(1, ...byType.map((x) => x.count));

  const packsPresent = Array.from(new Set(rows.map((d) => d.TypeofPack))).sort();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Exceptions" }, { label: "Damage Register" }]} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M06
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
              CMTS DamageDetail · 8 cols
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Damage Register
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Every damage finding, escalated or not. CMTS stores these rows but has no screen that
            reads them back.
            {isHq ? " All sites." : ` ${scope} only.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Damage records", value: String(rows.length), tone: "#0F172A" },
          { label: "Damaged pieces", value: String(totalPcs), tone: "#DC2626" },
          { label: "Damaged weight", value: formatKg(totalKg), tone: "#D97706" },
          { label: "Not escalated to CDR", value: String(unescalated), tone: "#7C3AED" },
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

      {byType.length > 0 && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Damage by cause</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5 mb-4">
            Eight canonical types. A histogram is only possible because the type is a constrained
            value rather than the free text CMTS allows in DEMAGEDETAIL.
          </p>
          <div className="flex flex-col gap-2.5">
            {byType.map((x) => (
              <div key={x.type} className="flex items-center gap-3">
                <span className="text-[12px] text-[#475569] w-[150px] flex-shrink-0 truncate">
                  {x.type}
                </span>
                <div className="flex-1 h-[18px] rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#DC2626]"
                    style={{ width: `${(x.count / maxType) * 100}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#0F172A] w-6 text-right">
                  {x.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            ["all", `All (${rows.length})`],
            ["escalated", `Escalated to CDR (${rows.length - unescalated})`],
            ["unescalated", `Not escalated (${unescalated})`],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer"
            style={{
              backgroundColor: filter === v ? "#0B2545" : "#FFFFFF",
              color: filter === v ? "#FFFFFF" : "#475569",
              borderColor: filter === v ? "#0B2545" : "#E2E8F0",
            }}
          >
            {label}
          </button>
        ))}

        <span className="w-px h-6 bg-[#E2E8F0] mx-1" />

        <select
          value={packFilter}
          onChange={(e) => setPackFilter(e.target.value)}
          className="h-8 px-3 rounded-lg text-[12px] font-medium text-[#475569] border border-[#E2E8F0] bg-white cursor-pointer"
        >
          <option value="all">All pack types</option>
          {packsPresent.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-[#94A3B8]">
          {PACK_TYPES.length} pack types modelled
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No damage records match"
          description="Damage is recorded at FC-01 acceptance and, when material, escalated into a CDR under FC-04."
        />
      ) : (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {[
                    "DamageId",
                    "AWB",
                    "Class",
                    "Pack",
                    "Damage type",
                    "Pcs",
                    "Weight",
                    "Evidence",
                    "CDR",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => {
                  const awb = awbById(d.AWBId);
                  return (
                    <tr
                      key={d.DamageId}
                      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-[12px] text-[#94A3B8]">
                        {d.DamageId}
                      </td>
                      <td className="px-4 py-3">
                        {awb ? (
                          <AwbLink awbNo={awb.AWBNO} awbId={awb.AWBId} />
                        ) : (
                          <span className="text-[12px] text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#475569] whitespace-nowrap">
                        {awb ? cargoClass(awb.CARGOCLASSID).ABBREVATION : "—"}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#475569]">{d.TypeofPack}</td>
                      <td className="px-4 py-3">
                        <span className="h-[22px] px-2.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-semibold inline-flex items-center gap-1 whitespace-nowrap">
                          <PackageX size={10} />
                          {d.TypeofDamage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#0F172A]">
                        {d.DamagedPcs}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#475569] whitespace-nowrap">
                        {formatKg(d.DamageWeight)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#475569]">
                          <Camera size={12} className="text-[#94A3B8]" />
                          {d.photos.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {d.cdrRef ? (
                          <Link
                            href="/exceptions/cdr"
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#1B4F8B] no-underline hover:underline"
                          >
                            {d.cdrRef} <ArrowUpRight size={11} />
                          </Link>
                        ) : (
                          <span className="h-[22px] px-2.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold inline-flex items-center gap-1">
                            <ShieldAlert size={10} />
                            NOT ESCALATED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Remarks detail — DEMAGEDETAIL is free text in CMTS and worth showing in full */}
      {visible.some((d) => d.Remarks) && (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Inspection remarks</h3>
          <div className="flex flex-col gap-3">
            {visible
              .filter((d) => d.Remarks)
              .map((d) => (
                <div
                  key={d.DamageId}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                      {awbById(d.AWBId)?.AWBNO ?? `#${d.DamageId}`}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {d.TypeofPack} · {d.TypeofDamage}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#475569] mt-1">{d.Remarks}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
