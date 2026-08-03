"use client";

/**
 * P0-3 · AWB register.
 *
 * This was a single hard-coded AWB detail page — one AWB, string literals,
 * unreachable from anywhere else. It is now the register: it lists the real
 * fixture set for the active site and links every row into the hub at
 * `/awb/[awbId]`, where detail now lives once instead of per-portal.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import AwbLink from "@/components/awb/AwbLink";
import { AgingBadge } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  BRANCH_LABEL,
  CARGO_CLASSES,
  DEMO_NOW,
  LIFECYCLE_LABEL,
  LIFECYCLE_ORDER,
  SECTION_82_DAYS,
  cargoClass,
  daysBetween,
  formatKg,
  listAwbs,
  type LifecycleStage,
} from "@/lib/domain";

export default function AwbRegisterPage() {
  const { scope, isHq } = useSite();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<LifecycleStage | "">("");
  const [classId, setClassId] = useState<number | "">("");

  const rows = useMemo(
    () =>
      listAwbs({
        scope,
        q: q || undefined,
        stage: stage || undefined,
        cargoClassId: classId || undefined,
      }),
    [scope, q, stage, classId],
  );

  const clear = () => {
    setQ("");
    setStage("");
    setClassId("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[{ label: "Warehouse Manager", href: "/warehouse-manager" }, { label: "AWB Register" }]}
        />
        <div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight">
            AWB Register
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            {rows.length} air waybill{rows.length === 1 ? "" : "s"}
            {isHq ? " across all sites" : ` at ${scope}`} · every row opens the AWB hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[380px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="AWB, IGM, consignee or flight…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#2E75B6] transition-colors"
          />
        </div>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as LifecycleStage | "")}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer"
        >
          <option value="">All stages</option>
          {LIFECYCLE_ORDER.map((s) => (
            <option key={s} value={s}>
              {LIFECYCLE_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : "")}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] outline-none cursor-pointer"
        >
          <option value="">All cargo classes</option>
          {CARGO_CLASSES.map((c) => (
            <option key={c.ID} value={c.ID}>
              {c.ABBREVATION} — {c.NAME}
            </option>
          ))}
        </select>
        {(q || stage || classId) && (
          <button
            onClick={clear}
            className="h-9 px-3 text-[12px] font-semibold text-[#1B4F8B] hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No AWBs match"
          description="Try clearing the filters, or switch site in the header."
          actionLabel="Clear filters"
          onAction={clear}
        />
      ) : (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left px-4 py-2.5">AWB</th>
                  <th className="text-left px-4 py-2.5">IGM</th>
                  {isHq && <th className="text-left px-4 py-2.5">Site</th>}
                  <th className="text-left px-4 py-2.5">Flight</th>
                  <th className="text-left px-4 py-2.5">Consignee</th>
                  <th className="text-left px-4 py-2.5">Class</th>
                  <th className="text-right px-4 py-2.5">Pcs</th>
                  <th className="text-right px-4 py-2.5">Chargeable</th>
                  <th className="text-left px-4 py-2.5">Stage</th>
                  <th className="text-left px-4 py-2.5">Dwell</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => {
                  const cls = cargoClass(a.CARGOCLASSID);
                  const days = daysBetween(a.arrivedAt, DEMO_NOW);
                  return (
                    <tr
                      key={a.AWBId}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <AwbLink awbNo={a.AWBNO} awbId={a.AWBId} />
                        {a.branch && (
                          <span className="ml-2 h-[18px] px-1.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
                            {BRANCH_LABEL[a.branch].split(" ")[0]}
                          </span>
                        )}
                        {a.HOLDINGSTATUS && (
                          <span className="ml-1.5 h-[18px] px-1.5 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center">
                            hold
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[12px] text-[#64748B]">{a.IGMNO}</td>
                      {isHq && <td className="px-4 py-2.5 font-semibold">{a.site}</td>}
                      <td className="px-4 py-2.5 font-mono text-[12px]">{a.FLIGHT}</td>
                      <td className="px-4 py-2.5 max-w-[220px] truncate">{a.CONSIGNEE1}</td>
                      <td className="px-4 py-2.5">
                        <span className="h-[20px] px-2 rounded bg-[#F1F5F9] text-[#0F172A] text-[11px] font-bold inline-flex items-center">
                          {cls.ABBREVATION}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">{a.TOTALPCS}</td>
                      <td className="px-4 py-2.5 text-right font-mono whitespace-nowrap">
                        {formatKg(a.TOTALCHRGWEIGHT)}
                      </td>
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap">
                        {LIFECYCLE_LABEL[a.stage]}
                      </td>
                      <td className="px-4 py-2.5">
                        <AgingBadge
                          totalDays={days}
                          freeDays={cls.freeDays}
                          section82Days={SECTION_82_DAYS}
                          compact
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[12px] text-[#94A3B8]">
        Detail for any AWB lives at{" "}
        <Link href="/awb/1" className="text-[#1B4F8B] font-medium no-underline hover:underline">
          /awb/[awbId]
        </Link>{" "}
        — the single hub FC-12 wires to M04, M05, M06, M09, M10, M15, M16 and M17.
      </p>
    </div>
  );
}
