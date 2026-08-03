"use client";

/**
 * P2-3 · Logical vs physical location.
 *
 * `IMPORTAWBLOCATION` carries two separate location pairs:
 *   LOGICALCARGOSUBCLASSID  + LOGICALLOCATIONID   — where it is booked to
 *   PHYSICALCARGOSUBCLASSID + PHYSICALLOCATIONID  — where it actually is
 *
 * Deliberate CMTS design: cargo can be assigned to a zone while sitting
 * somewhere else — staging, customs exam, a cold room during an excursion,
 * overflow. The demo modelled one location per item, which loses the
 * capability at migration.
 *
 * Retained pending BLK-08. A data profile from live CMTS (how often do the
 * two differ, and for how long) would settle it quickly.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Layers, MapPin } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AwbLink from "@/components/awb/AwbLink";
import EmptyState from "@/components/EmptyState";
import { useSite } from "@/components/site/SiteContext";
import {
  AWB_LOCATIONS,
  DEMO_NOW,
  cargoClass,
  cargoSubClass,
  daysBetween,
  formatDateTime,
  formatKg,
  listAwbs,
  listDivergedLocations,
  storageLocation,
} from "@/lib/domain";

type View = "all" | "diverged";

export default function LocationsPage() {
  const { scope, isHq } = useSite();
  const [view, setView] = useState<View>("all");

  const scoped = useMemo(() => listAwbs({ scope }), [scope]);
  const scopedNos = useMemo(() => new Set(scoped.map((a) => a.AWBNO)), [scoped]);

  const rows = useMemo(() => {
    const base = AWB_LOCATIONS.filter((l) => scopedNos.has(l.AWBNO));
    return view === "diverged"
      ? base.filter((l) => l.LOGICALLOCATIONID !== l.PHYSICALLOCATIONID)
      : base;
  }, [scopedNos, view]);

  const diverged = listDivergedLocations(scope);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Storage" }, { label: "Logical vs Physical" }]} />
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
              M05
            </span>
            <span className="h-[18px] px-1.5 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold inline-flex items-center">
              BLK-08 — dual model retained pending confirmation
            </span>
          </div>
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
            Logical vs Physical Location
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Where cargo is <em>booked to</em> against where it <em>actually is</em>. Pickers are
            routed by physical; stock and billing read logical.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Allocated consignments", value: rows.length, tone: "#0F172A" },
          {
            label: "Diverged",
            value: diverged.length,
            tone: diverged.length ? "#D97706" : "#16A34A",
          },
          {
            label: "Longest divergence",
            value: diverged.length
              ? `${Math.max(...diverged.map((d) => (d.divergedAt ? daysBetween(d.divergedAt, DEMO_NOW) : 0)))}d`
              : "—",
            tone: "#DC2626",
          },
          { label: "Sites in scope", value: isHq ? 3 : 1, tone: "#1B4F8B" },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-[26px] font-bold mt-1" style={{ color: k.tone }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {diverged.length > 0 && (
        <div className="rounded-[16px] border border-[#FDE68A] bg-[#FFFBEB] p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#D97706]">
              {diverged.length} consignment{diverged.length === 1 ? "" : "s"} not where the stock
              record says
            </p>
            <p className="text-[12px] text-[#92400E] mt-1">
              A picker routed by the logical location would find an empty rack. This queue is the
              reason the dual model earns its keep — collapse it and the divergence becomes
              invisible rather than absent.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {(
          [
            ["all", `All allocated (${rows.length})`],
            ["diverged", `Divergence queue (${diverged.length})`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className="h-9 px-3 rounded-lg border text-[12px] font-semibold cursor-pointer transition-colors"
            style={{
              borderColor: view === k ? "#0B2545" : "#E2E8F0",
              backgroundColor: view === k ? "#EBF0F7" : "white",
              color: view === k ? "#0B2545" : "#64748B",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={view === "diverged" ? "No divergence" : "Nothing allocated"}
          description={
            view === "diverged"
              ? "Every consignment is physically where the stock record says it is."
              : "Allocate cargo on the allocation engine screen."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((l) => {
            const logical = storageLocation(l.LOGICALLOCATIONID);
            const physical = storageLocation(l.PHYSICALLOCATIONID);
            const isDiv = l.LOGICALLOCATIONID !== l.PHYSICALLOCATIONID;
            const ageDays = l.divergedAt ? daysBetween(l.divergedAt, DEMO_NOW) : 0;

            return (
              <div
                key={l.Id}
                className="rounded-[16px] border bg-white overflow-hidden"
                style={{ borderColor: isDiv ? "#FDE68A" : "#E2E8F0" }}
              >
                <div
                  className="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap"
                  style={{
                    borderColor: isDiv ? "#FDE68A" : "#E2E8F0",
                    backgroundColor: isDiv ? "#FFFBEB" : "#F8FAFC",
                  }}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <AwbLink awbNo={l.AWBNO} />
                    <span className="font-mono text-[11px] text-[#64748B]">{l.IGMNO}</span>
                    <span className="h-[20px] px-2 rounded bg-white border border-[#E2E8F0] text-[#0F172A] text-[10px] font-bold inline-flex items-center font-mono">
                      {cargoClass(l.Cargoclassid).ABBREVATION}
                    </span>
                    {l.ConsolId && (
                      <span className="h-[20px] px-2 rounded bg-[#DBEAFE] text-[#1B4F8B] text-[10px] font-bold inline-flex items-center">
                        consolidation
                      </span>
                    )}
                    {l.DetendUniqueIdentification && (
                      <span className="h-[20px] px-2 rounded bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
                        detained
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[12px]">
                    <span className="text-[#64748B] font-mono">{l.PCS} pcs</span>
                    <span className="text-[#64748B] font-mono">{formatKg(l.WEIGHT)}</span>
                    {isDiv && (
                      <span className="h-[22px] px-2 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold inline-flex items-center">
                        diverged {ageDays}d
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  {/* Logical */}
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers size={14} className="text-[#64748B]" />
                      <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                        Logical — booked to
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A]">
                      {logical?.NAME ?? "—"}
                    </p>
                    <p className="text-[12px] text-[#64748B] font-mono mt-0.5">
                      {logical?.ABBREVATION} · {cargoSubClass(l.LOGICALCARGOSUBCLASSID).ABBREVATION}
                    </p>
                    <p className="text-[9px] font-mono text-[#CBD5E1] mt-2">
                      LOGICALLOCATIONID {l.LOGICALLOCATIONID}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight
                      size={20}
                      style={{ color: isDiv ? "#D97706" : "#CBD5E1" }}
                      className="rotate-90 md:rotate-0"
                    />
                  </div>

                  {/* Physical */}
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: isDiv ? "#FDE68A" : "#E2E8F0",
                      backgroundColor: isDiv ? "#FFFBEB" : "#F8FAFC",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} style={{ color: isDiv ? "#D97706" : "#64748B" }} />
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: isDiv ? "#D97706" : "#64748B" }}
                      >
                        Physical — actually in
                      </span>
                    </div>
                    <p
                      className="text-[14px] font-semibold"
                      style={{ color: isDiv ? "#D97706" : "#0F172A" }}
                    >
                      {physical?.NAME ?? "—"}
                    </p>
                    <p className="text-[12px] text-[#64748B] font-mono mt-0.5">
                      {physical?.ABBREVATION} ·{" "}
                      {cargoSubClass(l.PHYSICALCARGOSUBCLASSID).ABBREVATION}
                    </p>
                    <p className="text-[9px] font-mono text-[#CBD5E1] mt-2">
                      PHYSICALLOCATIONID {l.PHYSICALLOCATIONID}
                    </p>
                  </div>
                </div>

                {isDiv && (
                  <div className="px-5 pb-5">
                    <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#D97706]">
                        {l.divergenceReason}
                      </p>
                      <p className="text-[11px] text-[#92400E] mt-0.5">
                        Diverged {l.divergedAt ? formatDateTime(l.divergedAt) : "—"} · {ageDays} day
                        {ageDays === 1 ? "" : "s"} ago
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#0F172A] mb-2">Why two locations?</h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed">
          Cargo is routinely somewhere other than its booked zone — staged for a customs
          examination, moved out of a cold room during an excursion, or overflowed to an
          alternate rack. CMTS records both so the stock position stays correct while the cargo
          moves. Most modern WMS thinking would collapse this to one location plus movement
          states, which is why <strong>BLK-08</strong> asks the question rather than assuming.
        </p>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <Link
            href="/warehouse-manager/storage-map"
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#1B4F8B] no-underline inline-flex items-center"
          >
            Storage map
          </Link>
          <Link
            href="/storage/allocation"
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#1B4F8B] no-underline inline-flex items-center"
          >
            Allocation engine
          </Link>
        </div>
      </div>
    </div>
  );
}
