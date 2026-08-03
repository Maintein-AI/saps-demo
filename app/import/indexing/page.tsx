"use client";

/**
 * P1-4 · M03 AWB Indexing Workbench — full IMPORTAWB parity.
 *
 * FC-01 §09 "Indexation & Classification"; FC-12 draws M03 as the hub
 * feeding eight modules.
 *
 * `IMPORTAWB` is the widest operational table in CMTS at **64 columns**.
 * All 64 render here. Fields no AirVault flow uses still render, marked
 * "legacy — retained for migration", so the parity decision is visible at
 * sign-off rather than silently dropped.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Check, Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { AuditStrip } from "@/components/primitives";
import { useSite } from "@/components/site/SiteContext";
import {
  CARGO_CLASSES,
  PARTIES,
  cargoSubClass,
  formatDate,
  formatKg,
  formatPkr,
  listAwbs,
  subClassesOf,
  type AWB,
} from "@/lib/domain";

type FieldKind = "active" | "legacy";

interface FieldSpec {
  cmts: string;
  label: string;
  value: (a: AWB) => React.ReactNode;
  kind?: FieldKind;
  editable?: boolean;
}

/** All 64 IMPORTAWB columns, grouped as an operator would work through them. */
const SECTIONS: Array<{ title: string; hint: string; fields: FieldSpec[] }> = [
  {
    title: "Identity & keys",
    hint: "The CMTS composite key. IGMNO alone appears on ~25 tables.",
    fields: [
      { cmts: "AWBId", label: "AWB ID", value: (a) => a.AWBId, kind: "legacy" },
      { cmts: "ManifiestId", label: "Manifest ID", value: (a) => a.ManifiestId, kind: "legacy" },
      { cmts: "IGMNO", label: "IGM number", value: (a) => a.IGMNO },
      { cmts: "AWBNO", label: "AWB number", value: (a) => a.AWBNO, editable: true },
      { cmts: "SEQUENCE", label: "Sequence", value: (a) => a.SEQUENCE, editable: true },
      { cmts: "PAGENO", label: "Page number", value: (a) => a.PAGENO, editable: true },
      { cmts: "CARGODATE", label: "Cargo date", value: (a) => formatDate(a.CARGODATE) },
      { cmts: "CARGOTIME", label: "Cargo time", value: (a) => new Date(a.CARGOTIME).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) },
      { cmts: "REMARK", label: "Remark", value: (a) => a.REMARK, editable: true },
    ],
  },
  {
    title: "Flight & routing",
    hint: "Carried from the manifest — not re-keyed.",
    fields: [
      { cmts: "AIRLINECODE", label: "Airline code", value: (a) => a.AIRLINECODE },
      { cmts: "AIRLINENAME", label: "Airline name", value: (a) => a.AIRLINENAME },
      { cmts: "ABBREVATION", label: "Abbreviation", value: (a) => a.ABBREVATION },
      { cmts: "FLIGHT", label: "Flight", value: (a) => a.FLIGHT },
      { cmts: "ORIGIN", label: "Origin", value: (a) => a.ORIGIN },
      { cmts: "DESTINATION", label: "Destination", value: (a) => a.DESTINATION },
      { cmts: "SHIPMENTTYPE", label: "Shipment type", value: (a) => a.SHIPMENTTYPE, editable: true },
      { cmts: "PHYSICALSTATUS", label: "Physical status", value: (a) => a.PHYSICALSTATUS },
    ],
  },
  {
    title: "Shipper",
    hint: "CMTS stores each party as four flat lines.",
    fields: [
      { cmts: "SHIPPER1", label: "Shipper line 1", value: (a) => a.SHIPPER1, editable: true },
      { cmts: "SHIPPER2", label: "Shipper line 2", value: (a) => a.SHIPPER2, editable: true },
      { cmts: "SHIPPER3", label: "Shipper line 3", value: (a) => a.SHIPPER3, editable: true },
      { cmts: "SHIPPER4", label: "Shipper line 4", value: (a) => a.SHIPPER4, editable: true },
    ],
  },
  {
    title: "Consignee",
    hint: "Resolvable from the CONSIGNEE master — NTN / STN follow to the DO and GR.",
    fields: [
      { cmts: "CONSIGNEE1", label: "Consignee line 1", value: (a) => a.CONSIGNEE1, editable: true },
      { cmts: "CONSIGNEE2", label: "Consignee line 2", value: (a) => a.CONSIGNEE2, editable: true },
      { cmts: "CONSIGNEE3", label: "Consignee line 3", value: (a) => a.CONSIGNEE3, editable: true },
      { cmts: "CONSIGNEE4", label: "Consignee line 4", value: (a) => a.CONSIGNEE4, editable: true },
    ],
  },
  {
    title: "Agent",
    hint: "The clearing agent that will collect the DO.",
    fields: [
      { cmts: "AGENT1", label: "Agent line 1", value: (a) => a.AGENT1, editable: true },
      { cmts: "AGENT2", label: "Agent line 2", value: (a) => a.AGENT2, editable: true },
      { cmts: "AGENT3", label: "Agent line 3", value: (a) => a.AGENT3, editable: true },
      { cmts: "AGENT4", label: "Agent line 4", value: (a) => a.AGENT4, editable: true },
    ],
  },
  {
    title: "Cargo & weights",
    hint: "Chargeable weight = max(actual, volumetric) — FC-07 §06.",
    fields: [
      { cmts: "TOTALPCS", label: "Total pieces", value: (a) => a.TOTALPCS, editable: true },
      { cmts: "TOTALWEIGHT", label: "Total weight", value: (a) => formatKg(a.TOTALWEIGHT), editable: true },
      { cmts: "TOTALCHRGWEIGHT", label: "Chargeable weight", value: (a) => formatKg(a.TOTALCHRGWEIGHT) },
      { cmts: "CARGOCLASSID", label: "Cargo class", value: (a) => CARGO_CLASSES.find((c) => c.ID === a.CARGOCLASSID)?.ABBREVATION, editable: true },
    ],
  },
  {
    title: "Identity documents",
    hint: "PASSPORT and CHALLANNO had zero coverage in the demo before this screen.",
    fields: [
      { cmts: "NIC", label: "NIC", value: (a) => a.NIC, editable: true },
      { cmts: "PASSPORT", label: "Passport", value: (a) => a.PASSPORT, editable: true },
      { cmts: "CHALLANNO", label: "Challan number", value: (a) => a.CHALLANNO, editable: true },
      { cmts: "SHIFT", label: "Shift", value: (a) => a.SHIFT, editable: true },
    ],
  },
  {
    title: "Delivery order pre-fields",
    hint: "CMTS denormalises the DO onto the AWB. DOAMOUNT comes from AIRLINE.DOAMOUNT.",
    fields: [
      { cmts: "DONO", label: "DO number", value: (a) => a.DONO },
      { cmts: "DODATE", label: "DO date", value: (a) => (a.DODATE ? formatDate(a.DODATE) : null) },
      { cmts: "DOAMOUNT", label: "DO amount", value: (a) => formatPkr(a.DOAMOUNT) },
      { cmts: "DOFREE", label: "DO free", value: (a) => (a.DOFREE ? "Yes" : "No") },
    ],
  },
  {
    title: "State flags",
    hint: "These gate downstream modules — HOLDINGSTATUS feeds the FC-07 release gate.",
    fields: [
      { cmts: "HOLDINGSTATUS", label: "Holding status", value: (a) => (a.HOLDINGSTATUS ? "On hold" : "None") },
      { cmts: "Lock", label: "Locked", value: (a) => (a.Lock ? "Yes" : "No") },
      { cmts: "Status", label: "Status", value: (a) => a.Status },
      { cmts: "DELIVERED", label: "Delivered", value: (a) => (a.DELIVERED ? "Yes" : "No") },
      { cmts: "DFLAG", label: "Delete flag", value: (a) => (a.DFLAG ? "Y" : "N"), kind: "legacy" },
      { cmts: "IsHwb", label: "Is consolidation", value: (a) => (a.IsHwb ? "Yes" : "No"), editable: true },
      { cmts: "IsDetend", label: "Is detained", value: (a) => (a.IsDetend ? "Yes" : "No") },
      { cmts: "DetendUniqueIdentification", label: "Detend identifier", value: (a) => a.DetendUniqueIdentification },
      { cmts: "isSpecial", label: "Is special", value: (a) => (a.isSpecial ? "Yes" : "No") },
      { cmts: "isSpecialRemarks", label: "Special remarks", value: (a) => a.isSpecialRemarks, editable: true },
    ],
  },
  {
    title: "Process & transfer",
    hint: "TRAIRLINEID / TRID carry the transhipment linkage into FC-09.",
    fields: [
      { cmts: "ImportProcess", label: "Import process", value: (a) => a.ImportProcess, kind: "legacy" },
      { cmts: "Process", label: "Process", value: (a) => a.Process },
      { cmts: "TRAIRLINEID", label: "Transfer airline", value: (a) => a.TRAIRLINEID },
      { cmts: "TRID", label: "Transfer ID", value: (a) => a.TRID },
    ],
  },
  {
    title: "Audit & site keys",
    hint: "Nine columns present on ~60 and ~30 CMTS tables respectively.",
    fields: [
      { cmts: "CreatedBy", label: "Created by", value: (a) => a.CreatedBy, kind: "legacy" },
      { cmts: "CreatedDate", label: "Created date", value: (a) => formatDate(a.CreatedDate), kind: "legacy" },
      { cmts: "UpdatedBy", label: "Updated by", value: (a) => a.UpdatedBy, kind: "legacy" },
      { cmts: "UpdatedDate", label: "Updated date", value: (a) => (a.UpdatedDate ? formatDate(a.UpdatedDate) : null), kind: "legacy" },
      { cmts: "IsActive", label: "Is active", value: (a) => (a.IsActive ? "Yes" : "No"), kind: "legacy" },
      { cmts: "IsDeleted", label: "Is deleted", value: (a) => (a.IsDeleted ? "Yes" : "No"), kind: "legacy" },
      { cmts: "CityId", label: "City ID", value: (a) => a.CityId, kind: "legacy" },
      { cmts: "Comp_Code", label: "Company code", value: (a) => a.Comp_Code, kind: "legacy" },
      { cmts: "Off_Code", label: "Office code", value: (a) => a.Off_Code, kind: "legacy" },
    ],
  },
];

const TOTAL_FIELDS = SECTIONS.reduce((n, s) => n + s.fields.length, 0);

export default function IndexingWorkbenchPage() {
  const { scope } = useSite();
  const queue = useMemo(
    () => listAwbs({ scope }).filter((a) => ["awb-summary", "reconciliation", "indexation"].includes(a.stage)),
    [scope],
  );
  const all = useMemo(() => listAwbs({ scope }), [scope]);
  const candidates = queue.length > 0 ? queue : all;

  const [awbId, setAwbId] = useState<number>(candidates[0]?.AWBId ?? 0);
  const awb = candidates.find((a) => a.AWBId === awbId) ?? candidates[0];

  const [showLegacy, setShowLegacy] = useState(true);
  const [classId, setClassId] = useState<number>(awb?.CARGOCLASSID ?? 1);
  const [subClassId, setSubClassId] = useState<number>(awb?.cargoSubClassId ?? 101);

  if (!awb) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "AWB Indexing" }]} />
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#0F172A]">Nothing to index at {scope}</p>
        </div>
      </div>
    );
  }

  const legacyCount = SECTIONS.flatMap((s) => s.fields).filter((f) => f.kind === "legacy").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Import Documentation" }, { label: "AWB Indexing Workbench" }]} />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
                M03 — HUB
              </span>
              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center font-mono">
                FC-01 §09
              </span>
            </div>
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-tight mt-1.5">
              AWB Indexing Workbench
            </h1>
            <p className="text-[13px] text-[#64748B] mt-1">
              All {TOTAL_FIELDS} IMPORTAWB columns, labelled with both the AirVault label and the
              CMTS column name.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Indexing queue ({candidates.length})
            </span>
            <select
              value={awbId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setAwbId(id);
                const next = candidates.find((a) => a.AWBId === id);
                if (next) {
                  setClassId(next.CARGOCLASSID);
                  setSubClassId(next.cargoSubClassId);
                }
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

      {/* Classification carried from OCR intake, per the FC-02 amendment */}
      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#7C3AED]">
              Classification arrives from OCR intake — confirm, do not re-enter
            </p>
            <p className="text-[12px] text-[#6D28D9] mt-0.5">
              FC-02 amendment: &ldquo;set cargo classification (class / subclass) at Indexation&rdquo;. It was
              captured at 05b and operator-confirmed at 05c.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-[#6D28D9] uppercase tracking-wider">
                  Cargo class · CARGOCLASSID
                </span>
                <select
                  value={classId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setClassId(id);
                    setSubClassId(subClassesOf(id)[0]?.SUBCLASSID ?? subClassId);
                  }}
                  className="h-9 px-3 rounded-lg border border-[#DDD6FE] bg-white text-[13px] outline-none cursor-pointer"
                >
                  {CARGO_CLASSES.map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.ABBREVATION} — {c.NAME}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-[#6D28D9] uppercase tracking-wider">
                  Subclass · CARGOSUBCLASS
                </span>
                <select
                  value={subClassId}
                  onChange={(e) => setSubClassId(Number(e.target.value))}
                  className="h-9 px-3 rounded-lg border border-[#DDD6FE] bg-white text-[13px] outline-none cursor-pointer"
                >
                  {subClassesOf(classId).map((s) => (
                    <option key={s.SUBCLASSID} value={s.SUBCLASSID}>
                      {s.ABBREVATION} — {s.NAME}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-[#6D28D9] uppercase tracking-wider">
                  Handling authority
                </span>
                <div className="h-9 px-3 rounded-lg border border-[#DDD6FE] bg-white flex items-center text-[13px] text-[#0F172A]">
                  {cargoSubClass(subClassId).Authority ?? "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field-visibility control */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowLegacy((v) => !v)}
          className="h-9 px-3 rounded-lg border text-[12px] font-semibold cursor-pointer transition-colors"
          style={{
            borderColor: showLegacy ? "#E2E8F0" : "#2E75B6",
            backgroundColor: showLegacy ? "white" : "#EBF0F7",
            color: showLegacy ? "#64748B" : "#1B4F8B",
          }}
        >
          {showLegacy ? `Hide ${legacyCount} legacy-only fields` : `Show ${legacyCount} legacy-only fields`}
        </button>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B]">
          <span className="w-2.5 h-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]" />
          Active
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B]">
          <span className="w-2.5 h-2.5 rounded bg-[#FEF9C3] border border-[#FDE68A]" />
          Legacy — retained for migration
        </span>
      </div>

      {/* The 64 fields */}
      {SECTIONS.map((section) => {
        const fields = showLegacy ? section.fields : section.fields.filter((f) => f.kind !== "legacy");
        if (fields.length === 0) return null;
        return (
          <div key={section.title} className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">{section.title}</h3>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">{section.hint}</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4">
              {fields.map((f) => {
                const legacy = f.kind === "legacy";
                const v = f.value(awb);
                return (
                  <div key={f.cmts} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
                        {f.label}
                      </span>
                      {f.editable && <span className="text-[#DC2626] text-[11px] font-bold">*</span>}
                    </div>
                    <span className="text-[9px] font-mono text-[#CBD5E1] -mt-0.5">{f.cmts}</span>
                    <div
                      className="min-h-9 px-3 py-2 rounded-lg border flex items-center text-[13px] font-medium text-[#0F172A]"
                      style={{
                        borderColor: legacy ? "#FDE68A" : "#E2E8F0",
                        backgroundColor: legacy ? "#FEF9C3" : "#F8FAFC",
                      }}
                    >
                      {v === null || v === undefined || v === "" ? (
                        <span className="text-[#CBD5E1]">—</span>
                      ) : (
                        <span className="truncate">{v}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <AuditStrip record={awb} />

      {/* Validation summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Validation</h3>
        <div className="flex flex-col gap-2">
          {[
            { ok: !!awb.IGMNO, label: "IGM linkage present" },
            { ok: !!awb.AWBNO, label: "AWB number present" },
            { ok: awb.TOTALPCS > 0, label: "Pieces recorded" },
            { ok: awb.TOTALCHRGWEIGHT > 0, label: "Chargeable weight computed" },
            { ok: !!classId && !!subClassId, label: "Class and subclass confirmed at indexation" },
            { ok: !!awb.CONSIGNEE1, label: "Consignee identified" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              {c.ok ? (
                <Check size={14} className="text-[#16A34A]" strokeWidth={2.5} />
              ) : (
                <AlertCircle size={14} className="text-[#DC2626]" />
              )}
              <span className="text-[13px]" style={{ color: c.ok ? "#0F172A" : "#DC2626" }}>
                {c.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E2E8F0] flex-wrap">
          <Link
            href={`/awb/${awb.AWBId}`}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#0B2545] text-white text-[13px] font-semibold no-underline"
          >
            Open on AWB hub <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/import/acceptance"
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] no-underline inline-flex items-center"
          >
            Continue to acceptance
          </Link>
          {awb.IsHwb && (
            <Link
              href="/import/consolidation"
              className="h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] no-underline inline-flex items-center"
            >
              Break down house AWBs
            </Link>
          )}
        </div>
      </div>

      {/* Party master reference */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">Party master lookup</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            CMTS SHIPPER / CONSIGNEE / AGENCY — NTN and STN follow through to the DO and GR voucher
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-2.5">Role</th>
                <th className="text-left px-4 py-2.5">Name</th>
                <th className="text-left px-4 py-2.5">City</th>
                <th className="text-left px-4 py-2.5">NTN</th>
                <th className="text-left px-4 py-2.5">STN</th>
                <th className="text-left px-4 py-2.5">Channels</th>
              </tr>
            </thead>
            <tbody>
              {PARTIES.slice(0, 8).map((p) => (
                <tr key={p.ID} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-2.5 capitalize text-[#64748B]">{p.role}</td>
                  <td className="px-4 py-2.5 font-medium">{p.NAME}</td>
                  <td className="px-4 py-2.5 text-[#64748B]">{p.CITY}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{p.NTN ?? "—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{p.STN ?? "—"}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{p.channels.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
